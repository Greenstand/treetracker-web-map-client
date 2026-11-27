/**
 * Pre-check of a PR before its waiting CI run gets an approval.
 *
 * In a PR run each changed file can run as code (npm scripts, config files,
 * tests, the server code of the pages). This script reads the diff of a PR as
 * text and reports each file and each added line that a maintainer reads
 * before the approval. It never runs the code of the PR and it makes no
 * network request: the caller gives the diff and the other inputs.
 *
 * The result is "clean" (no rule found a sign) or "review". "Clean" is a
 * pre-check, not a proof that the code is safe: a rule can miss hidden code.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Linter } = require('eslint');

const UNREADABLE = 'diff line that the check cannot read';
const NO_PATH = '(path not read)';

const HUNK = /^@@ -\d+(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;
const FILE_MODE =
  /^(?:new file mode|new mode) (\d{6})$|^index [0-9a-f]+\.\.[0-9a-f]+ (\d{6})$/;
const MODE_NOTES = {
  120000: 'symbolic link',
  160000: 'submodule entry',
  100755: 'executable file',
};
const PLAIN_HEADER_LINES = [
  'index ',
  'old mode ',
  'new mode ',
  'new file mode ',
  'deleted file mode ',
  'similarity index ',
  'dissimilarity index ',
];
const QUOTE_ESCAPES = {
  a: 7,
  b: 8,
  t: 9,
  n: 10,
  v: 11,
  f: 12,
  r: 13,
  '"': 34,
  '\\': 92,
};

// Folders where a PR normally changes files. A file in another place
// (package files, workflows, config files, scripts) always gets a finding.
const USUAL_PREFIXES = [
  'src/',
  'cypress/tests/',
  'cypress/fixtures/',
  'public/',
  'doc/',
  'docs/',
];
const PROSE_SUFFIXES = ['.md', '.txt'];
const KNOWN_SUFFIXES = [
  '.js',
  '.json',
  '.css',
  '.svg',
  '.yaml',
  ...PROSE_SUFFIXES,
];
const PACKAGE_FILES = [
  'package.json',
  'package-lock.json',
  'npm-shrinkwrap.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];
const CONFIG_NAME = /\.config\.[a-z]+$|^(ts|js)config.*\.json$/;
const FIXTURE_CODE_SUFFIXES = [
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.coffee',
];
const MARKUP_SCRIPT =
  /<script\b|<foreignObject\b|\bjavascript:|\son[a-z]+\s*=/i;
const MAX_LINE_LENGTH = 300;
const SHOWN_TEXT = 140;
const SHOWN_CODE_POINTS = 5;
// Characters that a reader cannot see: control, format, line separator,
// paragraph separator, private use, not assigned, surrogate.
const HIDDEN = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}\p{Co}\p{Cn}\p{Cs}]/u;
// The line ends of JavaScript inside one diff line (ESLint counts them).
const JS_LINE_END = /\r\n|[\r\u2028\u2029]/;
const IP_ADDRESS = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
const MAX_FILES = 15;
const MAX_ADDED_LINES = 400;

// The text rules of the first pre-check. They read files that are not code,
// and code files that the parser cannot read.
const TEXT_NODE_MODULES =
  'fs|fs/promises|os|net|http|https|http2|dns|tls|dgram|vm|cluster|worker_threads|' +
  'child_process|module|inspector|repl|zlib|crypto|stream|readline|v8|process';
const TEXT_RULES = [
  [
    'request to another host',
    /\b(fetch|axios|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b|\bcy\.request\b/,
  ],
  [
    'process or shell',
    new RegExp(
      'child_process|\\b(exec|execSync|execFile|execFileSync|spawn|spawnSync)\\s*\\(|\\bcy\\.(exec|task)\\b' +
        '|\\bprocess\\.(env|binding|mainModule|argv|kill|exit|stdout|stdin|dlopen)\\b',
    ),
  ],
  [
    'file or system access',
    new RegExp(
      '\\b(fs|os|net|dns|tls|vm|http|https|dgram|cluster|worker_threads|inspector)\\.[A-Za-z]+\\s*\\(' +
        '|__dirname|__filename|\\bcy\\.(readFile|writeFile)\\b|\\bglobalThis\\b|\\bglobal\\.',
    ),
  ],
  [
    'Node.js module import',
    new RegExp(
      `(from\\s+|require\\s*\\(\\s*|import\\s*\\(\\s*)['"](node:)?(${TEXT_NODE_MODULES})['"]`,
    ),
  ],
  [
    'process or network package',
    /['"](execa|shelljs|cross-spawn|node-fetch|got|request|superagent|undici|ws|socket\.io-client|puppeteer|playwright|nodemailer)['"]/,
  ],
  [
    'dynamic code',
    /\beval\s*\(|\bnew\s+Function\b|\bFunction\s*\(|constructor\.constructor|\bWebAssembly\b|\bset(Timeout|Interval)\s*\(\s*['"`]|\bimport\s*\(\s*[^'"\s]|\brequire\s*\(\s*[^'"\s]/,
  ],
  [
    'encoded text',
    /\batob\b|\bbtoa\b|Buffer\.from|fromCharCode|fromCodePoint|base64|\\x[0-9a-fA-F]{2}|\\u\{?[0-9a-fA-F]{2,}|[A-Za-z0-9+/=_-]{80,}|[0-9a-fA-F]{48,}/,
  ],
];

// Each character outside printable ASCII as <U+XXXX>, a tab as a space.
function printable(text) {
  return Array.from(text, (char) => {
    if (char >= ' ' && char <= '~') return char;
    if (char === '\t') return ' ';
    return `<U+${char
      .codePointAt(0)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0')}>`;
  }).join('');
}

// The path of a diff header value. Git puts a path with special characters in
// quotes, with octal escapes for the bytes of each character outside ASCII.
function gitPath(text) {
  const value = text.replace(/\t$/, '');
  if (value.length < 2 || !(value.startsWith('"') && value.endsWith('"'))) {
    return value;
  }
  const body = value.slice(1, -1);
  const bytes = [];
  let index = 0;
  while (index < body.length) {
    const char = body[index];
    const octal = body.slice(index + 1, index + 4);
    if (char !== '\\') {
      bytes.push(...Buffer.from(char, 'utf8'));
      index += 1;
    } else if (/^[0-7]{3}$/.test(octal)) {
      bytes.push(parseInt(octal, 8) % 256);
      index += 4;
    } else {
      bytes.push(QUOTE_ESCAPES[body.slice(index + 1, index + 2)] ?? 63);
      index += 2;
    }
  }
  return Buffer.from(bytes).toString('utf8');
}

// The path from the text after "diff --git ", or "" when its two paths are not
// equal. A path can hold " b/", so the text is not split at that mark: the two
// paths are equal for each change that is not a rename. A rename gives its new
// path in the line "rename to".
function headerPath(rest) {
  if (rest.startsWith('"') && rest.endsWith('"')) {
    const middle = rest.indexOf('" "');
    if (middle < 0) return '';
    const oldPath = gitPath(rest.slice(0, middle + 1));
    const newPath = gitPath(rest.slice(middle + 2));
    const same =
      oldPath.startsWith('a/') &&
      newPath.startsWith('b/') &&
      oldPath.slice(2) === newPath.slice(2);
    return same ? newPath.slice(2) : '';
  }
  const size = (rest.length - 'a/ b/'.length) / 2;
  if (!Number.isInteger(size) || size <= 0) return '';
  const name = rest.slice(2, 2 + size);
  return rest === `a/${name} b/${name}` ? name : '';
}

// The path of a "---" or "+++" line, or "" for /dev/null.
function sidePath(text) {
  const value = gitPath(text);
  return value === '/dev/null' ? '' : value.replace(/^[ab]\//, '');
}

function note(file, rule, detail = '') {
  if (
    !file.notes.some((item) => item.rule === rule && item.detail === detail)
  ) {
    file.notes.push({ rule, detail });
  }
}

// The note of a header line that names an old path.
const FROM_LINES = [
  ['rename from ', 'renamed file'],
  ['copy from ', 'copied file'],
];

// The meaning of a "---" or "+++" line, as data.
function sideLineEffect(line, currentPath) {
  const value = sidePath(line.slice(4));
  const effect = line === '--- /dev/null' ? { isNew: true } : {};
  if (value && !currentPath) return { ...effect, path: value };
  if (value && value !== currentPath && line.startsWith('+++ ')) {
    return { ...effect, note: 'the path lines of the diff do not agree' };
  }
  return effect;
}

// The meaning of one line of a file header, as data: a note, a path, a new
// file, or binary patch data that follows.
function headerLineEffect(line, currentPath) {
  const mode = FILE_MODE.exec(line);
  if (mode) {
    const text = MODE_NOTES[mode[1] || mode[2]];
    return text ? { note: text } : {};
  }
  if (line.startsWith('Binary files ') || line.startsWith('GIT binary patch')) {
    return {
      note: 'binary file',
      binaryData: line.startsWith('GIT binary patch'),
    };
  }
  const from = FROM_LINES.find(([prefix]) => line.startsWith(prefix));
  if (from) {
    return {
      note: from[1],
      detail: `from ${gitPath(line.slice(from[0].length))}`,
    };
  }
  if (line.startsWith('rename to ') || line.startsWith('copy to ')) {
    return { path: gitPath(line.split(' ').slice(2).join(' ')) };
  }
  if (line.startsWith('--- ') || line.startsWith('+++ ')) {
    return sideLineEffect(line, currentPath);
  }
  const plain = PLAIN_HEADER_LINES.some((begin) => line.startsWith(begin));
  return plain ? {} : { note: UNREADABLE };
}

// Split only at a line feed, so that no part of a line is lost when the line
// holds a lone CR, a form feed or U+2028. One CR before the line feed goes.
function diffLines(text) {
  return text.split('\n').map((line) => line.replace(/\r$/, ''));
}

// A file change with the effect of one header line.
function withEffect(file, effect) {
  const next = { ...file, notes: [...file.notes] };
  if (effect.note) note(next, effect.note, effect.detail);
  return {
    ...next,
    path: effect.path || file.path,
    isNew: file.isNew || Boolean(effect.isNew),
  };
}

// What one line of a hunk uses of the line counts of the hunk header, by its
// first character: an added line, a context line (also an empty one), a
// deleted line, and the mark "No newline at end of file".
const HUNK_STEPS = {
  '+': { old: 0, new: 1 },
  ' ': { old: 1, new: 1 },
  '': { old: 1, new: 1 },
  '-': { old: 1, new: 0 },
  '\\': { old: 0, new: 0 },
};

function parseDiff(text) {
  const files = [];
  let current = null;
  let oldLeft = 0;
  let newLeft = 0;
  let lineNumber = 0;
  let binaryData = false;
  diffLines(text).forEach((line) => {
    if (current && (oldLeft > 0 || newLeft > 0)) {
      const step = HUNK_STEPS[line.slice(0, 1)];
      if (step) {
        if (line.startsWith('+')) {
          current.added.push({ line: lineNumber, text: line.slice(1) });
        }
        oldLeft -= step.old;
        newLeft -= step.new;
        lineNumber += step.new;
        return;
      }
      note(current, UNREADABLE);
      oldLeft = 0;
      newLeft = 0;
    }
    if (line.startsWith('diff --git ')) {
      current = {
        path: headerPath(line.slice('diff --git '.length)),
        notes: [],
        added: [],
        isNew: false,
      };
      files.push(current);
      binaryData = false;
      return;
    }
    if (!current || binaryData || !line || line.startsWith('\\')) return;
    const hunk = HUNK.exec(line);
    if (hunk) {
      oldLeft = Number(hunk[1] ?? '1');
      lineNumber = Number(hunk[2]);
      newLeft = Number(hunk[3] ?? '1');
    } else {
      const effect = headerLineEffect(line, current.path);
      current = withEffect(current, effect);
      files[files.length - 1] = current;
      binaryData = Boolean(effect.binaryData);
    }
  });
  return files.map((file) =>
    file.path
      ? file
      : {
          ...file,
          path: NO_PATH,
          notes: [
            ...file.notes,
            { rule: 'path that the check cannot read', detail: '' },
          ],
        },
  );
}

const CODE_SUFFIX = /\.(js|jsx|mjs|cjs)$/i;
const REPO_ROOT = path.resolve(__dirname, '..');

// Global names that code in the usual folders can use without a finding.
const ALLOWED_GLOBALS = [
  'console',
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'URL',
  'URLSearchParams',
  'localStorage',
  'sessionStorage',
  'location',
  'history',
  'alert',
  'Event',
  'CustomEvent',
  'getComputedStyle',
  'matchMedia',
  'performance',
  'IntersectionObserver',
  'ResizeObserver',
  'MutationObserver',
  'HTMLElement',
  'Element',
  'Node',
  'AbortController',
  'structuredClone',
  'describe',
  'it',
  'test',
  'expect',
  'beforeEach',
  'afterEach',
  'beforeAll',
  'afterAll',
  'before',
  'after',
  'context',
];

// Global objects that code can use only as the object of a plain member
// access, and the members that the check does not allow.
const ROOT_OBJECTS = {
  process: [],
  window: [
    'fetch',
    'eval',
    'Function',
    'XMLHttpRequest',
    'WebSocket',
    'EventSource',
    'Worker',
    'SharedWorker',
    'open',
    'opener',
    'top',
    'parent',
    'frames',
    'self',
    'globalThis',
    'Reflect',
    'Proxy',
  ],
  document: ['write', 'writeln', 'cookie', 'domain', 'execCommand'],
  navigator: ['sendBeacon', 'serviceWorker'],
  cy: ['exec', 'task', 'request', 'readFile', 'writeFile', 'now'],
  Cypress: ['backend', 'automation'],
  jest: [
    'requireActual',
    'requireMock',
    'createMockFromModule',
    'genMockFromModule',
  ],
};
const OBJECT_MEMBERS = ['constructor', '__proto__', 'prototype'];

// Built-in globals that run code from text or reach each object.
const BLOCKED_GLOBALS = [
  'eval',
  'Function',
  'Reflect',
  'Proxy',
  'globalThis',
  'WebAssembly',
  'unescape',
  'escape',
];

const NODE_MODULES = [
  'fs',
  'fs/promises',
  'os',
  'net',
  'http',
  'https',
  'http2',
  'dns',
  'tls',
  'dgram',
  'vm',
  'cluster',
  'worker_threads',
  'child_process',
  'inspector',
  'repl',
  'zlib',
  'crypto',
  'readline',
  'v8',
  'wasi',
  'async_hooks',
  'perf_hooks',
  'trace_events',
  'diagnostics_channel',
];
const RUNNABLE_ELEMENTS = ['script', 'iframe', 'frame', 'object', 'embed'];
const KNOWN_HOSTS = [
  'localhost',
  '127.0.0.1',
  'treetracker.org',
  'greenstand.org',
  'www.w3.org',
  'example.com',
];
const URL_IN_TEXT = /\b[a-z][a-z0-9+.-]*:\/\/[^\s'"<>`]+/gi;
const ENCODED = /[A-Za-z0-9+/=_-]{80,}|[0-9a-fA-F]{48,}/;
const STRING_ESCAPE = /\\(x|u|[0-7]|\r?\n|\u2028|\u2029)/;

// The packages of the repo and the folders of src. An import of one of them
// gets no finding. The script reads them from the checkout that runs it.
function repoNames(root) {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
  );
  const packages = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
  const folders = new Set(
    fs
      .readdirSync(path.join(root, 'src'))
      .map((name) => name.replace(/\.[^.]+$/, '')),
  );
  return { packages, folders };
}

function hostIsKnown(host) {
  const name = host.toLowerCase().replace(/\.$/, '');
  return KNOWN_HOSTS.some(
    (known) => name === known || name.endsWith(`.${known}`),
  );
}

// The hosts of the URLs in a string, also of a URL with no scheme ("//host").
function urlHosts(value) {
  const candidates = value.match(URL_IN_TEXT) ?? [];
  if (/^\/\/[^\s/]/.test(value)) candidates.push(`https:${value}`);
  return candidates.flatMap((candidate) => {
    try {
      const { hostname } = new URL(candidate);
      return hostname ? [hostname] : [];
    } catch {
      return [];
    }
  });
}

function packageName(source) {
  const parts = source.split('/');
  return source.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

// The value of a string, a template without expressions, or a join of them.
function constantString(node) {
  if (node.type === 'Literal' && typeof node.value === 'string')
    return node.value;
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0].value.cooked;
  }
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const left = constantString(node.left);
    const right = constantString(node.right);
    return left === null || right === null ? null : left + right;
  }
  return null;
}

function memberName(node) {
  if (!node.computed && node.property.type === 'Identifier')
    return node.property.name;
  if (node.computed && node.property.type === 'Literal')
    return String(node.property.value);
  return null;
}

// The detail of a use of a root object that the check does not allow, or null.
function rootUse(identifier) {
  const { name, parent } = identifier;
  if (parent.type === 'UnaryExpression' && parent.operator === 'typeof')
    return null;
  const plain =
    parent.type === 'MemberExpression' &&
    parent.object === identifier &&
    !parent.computed &&
    !parent.optional;
  if (!plain) return name;
  const member = parent.property.name;
  if (name === 'process') {
    const outer = parent.parent;
    const named =
      member === 'env' &&
      outer.type === 'MemberExpression' &&
      outer.object === parent &&
      !outer.computed &&
      !outer.optional;
    return named ? null : `process.${member}`;
  }
  if (ROOT_OBJECTS[name].includes(member) || OBJECT_MEMBERS.includes(member)) {
    return `${name}.${member}`;
  }
  return null;
}

const LINTER_CONFIG = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: { es2022: true },
  globals: Object.fromEntries([
    ...ALLOWED_GLOBALS.map((name) => [name, 'readonly']),
    ...Object.keys(ROOT_OBJECTS).map((name) => [name, 'readonly']),
    ...BLOCKED_GLOBALS.map((name) => [name, 'off']),
  ]),
  rules: { 'pre-check/code': 'error' },
};

// The own rule of the check. It collects its findings itself, so that each
// finding keeps its rule and its detail as data.
function codeRule(filePath, names, found) {
  return {
    create(context) {
      const sourceCode = context.getSourceCode();
      const add = (rule, detail, node) =>
        found.push({ rule, detail, line: node.loc.start.line });

      function checkString(value, raw, node) {
        if (raw !== null && STRING_ESCAPE.test(raw)) {
          add('escaped characters in a string', '', node);
        }
        const moduleName = value.replace(/^node:/, '');
        if (value.startsWith('node:') || NODE_MODULES.includes(moduleName)) {
          add('Node.js module name in a string', value, node);
        }
        urlHosts(value)
          .filter((host) => !hostIsKnown(host))
          .forEach((host) => add('URL of another host', host, node));
        if (ENCODED.test(value)) add('encoded text', '', node);
      }

      function checkSource(source, node) {
        const { value } = source;
        if (/^\.{1,2}\//.test(value)) {
          const target = path.posix.normalize(
            path.posix.join(path.posix.dirname(filePath), value),
          );
          if (!USUAL_PREFIXES.some((prefix) => target.startsWith(prefix))) {
            add('import of a file outside the usual folders', value, node);
          }
          return;
        }
        const first = value.split('/')[0];
        if (
          !names.folders.has(first) &&
          !names.packages.has(packageName(value))
        ) {
          add('import of a package that the check does not allow', value, node);
        }
      }

      return {
        Literal(node) {
          if (typeof node.value === 'string')
            checkString(node.value, node.raw, node);
        },
        TemplateElement(node) {
          checkString(node.value.cooked ?? '', node.value.raw, node);
        },
        BinaryExpression(node) {
          const value = constantString(node);
          const parentJoins =
            node.parent.type === 'BinaryExpression' &&
            constantString(node.parent) !== null;
          if (value === null || parentJoins) return;
          add('string joined from constants', '', node);
          checkString(value, null, node);
        },
        Identifier(node) {
          if (sourceCode.getText(node) !== node.name) {
            add('escaped characters in a name', node.name, node);
          }
        },
        MemberExpression(node) {
          const inner = node.object;
          if (
            memberName(node) === 'constructor' &&
            inner.type === 'MemberExpression' &&
            memberName(inner) === 'constructor'
          ) {
            add('constructor chain', '', node);
          }
        },
        CallExpression(node) {
          const { callee } = node;
          const first = node.arguments[0];
          if (
            callee.type === 'MemberExpression' &&
            callee.object.type === 'Identifier' &&
            callee.object.name === 'document' &&
            memberName(callee) === 'createElement'
          ) {
            const tag =
              first && first.type === 'Literal'
                ? String(first.value).toLowerCase()
                : '?';
            if (tag === '?' || RUNNABLE_ELEMENTS.includes(tag)) {
              add('element that can run code', tag, node);
            }
          }
          if (
            callee.type === 'Identifier' &&
            ['setTimeout', 'setInterval'].includes(callee.name) &&
            first &&
            constantString(first) !== null
          ) {
            add('code in a string for a timer', callee.name, node);
          }
        },
        ImportDeclaration(node) {
          checkSource(node.source, node);
        },
        ExportNamedDeclaration(node) {
          if (node.source) checkSource(node.source, node);
        },
        ExportAllDeclaration(node) {
          checkSource(node.source, node);
        },
        ImportExpression(node) {
          const source = constantString(node.source);
          add('dynamic import', source ?? '', node);
        },
        'Program:exit': () => {
          const scope = context.getScope();
          scope.through.forEach((reference) => {
            add(
              'global name that the check does not allow',
              reference.identifier.name,
              reference.identifier,
            );
          });
          Object.keys(ROOT_OBJECTS).forEach((name) => {
            const variable = scope.set.get(name);
            (variable ? variable.references : []).forEach((reference) => {
              const detail = rootUse(reference.identifier);
              if (detail) {
                add(
                  'use of a root object that the check does not allow',
                  detail,
                  reference.identifier,
                );
              }
            });
          });
        },
      };
    },
  };
}

// The findings of the parser in one code file.
function codeFindings(filePath, text, names) {
  const found = [];
  const linter = new Linter();
  linter.defineRule('pre-check/code', codeRule(filePath, names, found));
  const messages = linter.verify(text, LINTER_CONFIG, {
    allowInlineConfig: false,
  });
  const fatal = messages.find((message) => message.fatal);
  if (fatal) {
    return [
      {
        rule: 'code that the parser cannot read',
        detail: fatal.message,
        line: fatal.line ?? null,
        unreadable: true,
      },
    ];
  }
  return found;
}

function suffixOf(name) {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot).toLowerCase() : '';
}

function isProse(filePath) {
  return PROSE_SUFFIXES.some((suffix) =>
    filePath.toLowerCase().endsWith(suffix),
  );
}

// The findings that the path of a changed file gives.
function pathFindings(filePath, { binary = false } = {}) {
  const parts = filePath.split('/');
  const name = parts[parts.length - 1];
  const suffix = suffixOf(name);
  const rules = [];
  const usual =
    USUAL_PREFIXES.some((prefix) => filePath.startsWith(prefix)) ||
    (!filePath.includes('/') && suffix === '.md');
  if (!usual) rules.push('file outside the usual folders (it can run in CI)');
  if (printable(filePath) !== filePath) {
    rules.push('control or non-ASCII character in the path');
  }
  if (parts.some((part) => part.startsWith('.'))) {
    rules.push('dotfile or dot folder (a tool can load it as config)');
  }
  if (PACKAGE_FILES.includes(name)) {
    rules.push('package file (npm and Node.js read it)');
  }
  if (CONFIG_NAME.test(name)) rules.push('config file (a tool loads it)');
  if (parts.includes('__snapshots__') || suffix === '.snap') {
    rules.push('Jest snapshot (Jest runs it as code)');
  }
  if (parts.includes('__mocks__')) {
    rules.push('Jest mock folder (Jest loads it without an import)');
  }
  if (
    filePath.startsWith('cypress/fixtures/') &&
    FIXTURE_CODE_SUFFIXES.includes(suffix)
  ) {
    rules.push('code file in cypress/fixtures (Cypress can run it)');
  }
  if (!binary && !KNOWN_SUFFIXES.includes(suffix)) {
    rules.push('file type that the check does not know');
  }
  return rules.map((rule) => ({
    rule,
    detail: '',
    file: filePath,
    line: null,
  }));
}

function shownText(text) {
  return printable(text).trim().slice(0, SHOWN_TEXT);
}

function codePoints(chars) {
  const names = [...chars]
    .map((char) => char.codePointAt(0))
    .sort((a, b) => a - b)
    .map((code) => `U+${code.toString(16).toUpperCase().padStart(4, '0')}`);
  const more = names.length > SHOWN_CODE_POINTS ? ['...'] : [];
  return [...names.slice(0, SHOWN_CODE_POINTS), ...more].join(', ');
}

// The findings for the characters of one added line outside printable ASCII.
function characterFindings(file, { line, text }) {
  const hidden = new Set();
  const other = new Set();
  Array.from(text).forEach((char) => {
    if (char === '\t' || (char >= ' ' && char <= '~')) return;
    if (HIDDEN.test(char)) hidden.add(char);
    else other.add(char);
  });
  const found = [];
  const base = { file: file.path, line, text: shownText(text) };
  if (hidden.size) {
    found.push({
      ...base,
      rule: 'control or invisible character',
      detail: codePoints(hidden),
    });
  }
  if (other.size && !isProse(file.path)) {
    found.push({
      ...base,
      rule: 'non-ASCII character in a code file',
      detail: codePoints(other),
    });
  }
  return found;
}

// The findings of the text rules in the added lines of one file.
function textFindings(file) {
  const found = [];
  file.added.forEach(({ line, text }) => {
    const hosts = [
      ...new Set(urlHosts(text).filter((host) => !hostIsKnown(host))),
    ];
    if (hosts.length) {
      found.push({
        rule: 'URL of another host',
        detail: hosts.sort().join(', '),
        file: file.path,
        line,
        text: shownText(text),
      });
    }
    TEXT_RULES.forEach(([rule, pattern]) => {
      if (pattern.test(text)) {
        found.push({
          rule,
          detail: '',
          file: file.path,
          line,
          text: shownText(text),
        });
      }
    });
  });
  return found;
}

// The findings of the added lines of a file, by its type.
function lineFindings(file) {
  const found = [];
  file.added.forEach((added) => {
    found.push(...characterFindings(file, added));
    const { line, text } = added;
    const base = { detail: '', file: file.path, line, text: shownText(text) };
    if (!isProse(file.path)) {
      const addresses = (text.match(IP_ADDRESS) ?? []).filter(
        (address) =>
          address !== '127.0.0.1' &&
          address.split('.').every((part) => Number(part) <= 255),
      );
      if (addresses.length) found.push({ ...base, rule: 'IP address' });
      if (text.length > MAX_LINE_LENGTH) {
        found.push({
          ...base,
          rule: `line longer than ${MAX_LINE_LENGTH} characters`,
        });
      }
    }
    if (file.path.toLowerCase().endsWith('.svg') && MARKUP_SCRIPT.test(text)) {
      found.push({
        rule: 'script or event handler in an SVG file',
        detail: '',
        file: file.path,
        line,
        text: shownText(text),
      });
    }
  });
  return found;
}

// The lines of the new text of a code file: from the diff for a new file,
// from the caller for a changed file. Null when the text is not known.
function newLines(file, readNewFile) {
  if (file.isNew) return file.added.map((added) => added.text);
  const text = readNewFile ? readNewFile(file.path) : null;
  return typeof text === 'string' ? diffLines(text) : null;
}

function fileFinding(file, rule) {
  return { rule, detail: '', file: file.path, line: null };
}

// The findings of the parser in a code file, only for its added lines.
function codeFileFindings(file, names, readNewFile) {
  const lines = newLines(file, readNewFile);
  if (lines === null) {
    return [
      fileFinding(file, 'code file that the check cannot read whole'),
      ...textFindings(file),
    ];
  }
  if (file.added.some((added) => lines[added.line - 1] !== added.text)) {
    return [
      fileFinding(file, 'new file text that does not match the diff'),
      ...textFindings(file),
    ];
  }
  const added = new Set(file.added.map((item) => item.line));
  // The file line of each line that ESLint counts.
  const lineMap = lines.flatMap((text, index) =>
    text.split(JS_LINE_END).map(() => ({ line: index + 1, text })),
  );
  const found = [];
  const code = codeFindings(file.path, lines.join('\n'), names);
  code.forEach(({ unreadable, line, ...item }) => {
    const where = line ? lineMap[line - 1] : undefined;
    if (where && !added.has(where.line)) return;
    found.push({
      ...item,
      file: file.path,
      line: where ? where.line : null,
      text: where ? shownText(where.text) : '',
    });
  });
  if (code.some((item) => item.unreadable)) found.push(...textFindings(file));
  return found;
}

const WORKFLOW_PATH =
  /^\.github\/(workflows\/[^/]+|actions\/.+\/action)\.ya?ml$/;

// The zizmor findings of a changed workflow file that its old text does not
// have. The caller gives the runner: it returns a list of findings, or null
// when zizmor is not there.
function zizmorFindings(file, { readOldFile, readNewFile, zizmor }) {
  const notRun = (detail) => [
    { ...fileFinding(file, 'zizmor not run'), detail },
  ];
  const lines = newLines(file, readNewFile);
  if (lines === null) return notRun('no whole new file');
  const newFound = zizmor ? zizmor(lines.join('\n'), file.path) : null;
  if (!Array.isArray(newFound)) return notRun('zizmor is not on this machine');
  const oldText = file.isNew || !readOldFile ? null : readOldFile(file.path);
  const oldFound =
    typeof oldText === 'string' ? zizmor(oldText, file.path) ?? [] : [];
  const key = (item) => `${item.id}: ${item.message}`;
  const left = new Map();
  oldFound.forEach((item) =>
    left.set(key(item), (left.get(key(item)) ?? 0) + 1),
  );
  return newFound.flatMap((item) => {
    const count = left.get(key(item)) ?? 0;
    if (count > 0) {
      left.set(key(item), count - 1);
      return [];
    }
    return [
      {
        rule: 'workflow finding of zizmor',
        detail: key(item),
        file: file.path,
        line: item.line ?? null,
        text: item.line ? shownText(lines[item.line - 1] ?? '') : '',
      },
    ];
  });
}

function fileFindings(file, names, inputs) {
  const found = pathFindings(file.path, {
    binary: file.notes.some((item) => item.rule === 'binary file'),
  });
  file.notes.forEach(({ rule, detail }) => {
    found.push({ rule, detail, file: file.path, line: null });
  });
  found.push(...lineFindings(file));
  if (WORKFLOW_PATH.test(file.path) && file.added.length) {
    found.push(...zizmorFindings(file, inputs));
  }
  if (CODE_SUFFIX.test(file.path) && file.added.length) {
    found.push(...codeFileFindings(file, names, inputs.readNewFile));
  } else if (!isProse(file.path)) {
    found.push(...textFindings(file));
  }
  return found;
}

// The findings of the diff as a whole.
function diffFindings(files) {
  const found = [];
  const added = files.reduce((total, file) => total + file.added.length, 0);
  if (!files.length) {
    found.push({
      rule: 'no file in the diff',
      detail: '',
      file: '',
      line: null,
    });
  }
  if (files.length > MAX_FILES) {
    found.push({
      rule: `more than ${MAX_FILES} files`,
      detail: `${files.length} files`,
      file: '',
      line: null,
    });
  }
  if (added > MAX_ADDED_LINES) {
    found.push({
      rule: `more than ${MAX_ADDED_LINES} added lines`,
      detail: `${added} lines`,
      file: '',
      line: null,
    });
  }
  return found;
}

// The findings of a comparison with the file list of GitHub.
function listFindings(files, listed) {
  if (!Array.isArray(listed)) return [];
  const shown = new Set(files.map((file) => file.path));
  const found = [];
  listed
    .filter((name) => !shown.has(name))
    .forEach((name) => {
      found.push({
        rule: 'file that the diff does not show',
        detail: '',
        file: name,
        line: null,
      });
      found.push(...pathFindings(name));
    });
  files
    .filter((file) => !listed.includes(file.path))
    .forEach((file) =>
      found.push(
        fileFinding(file, 'file of the diff that GitHub does not list'),
      ),
    );
  return found;
}

// Check a diff. The inputs: `files`, the file list of GitHub; `readNewFile`
// and `readOldFile`, functions that give the whole new or old text of a
// changed file (or null); `zizmor`, a runner for workflow files; `root`, the
// checkout whose packages and src folders an import can use.
function preCheck(diff, inputs = {}) {
  const { files: listed, root = REPO_ROOT } = inputs;
  const files = parseDiff(diff);
  const names = repoNames(root);
  const findings = [
    ...diffFindings(files),
    ...listFindings(files, listed),
    ...files.flatMap((file) => fileFindings(file, names, inputs)),
  ];
  return { verdict: findings.length ? 'review' : 'clean', findings, files };
}

// One fixed reason sentence for each rule: why a maintainer reads the finding.
const REASONS = {
  'no file in the diff':
    'The input has no file change, so it is not a normal diff.',
  [`more than ${MAX_FILES} files`]:
    'A large change is hard to read, so a person must read it.',
  [`more than ${MAX_ADDED_LINES} added lines`]:
    'A large change is hard to read, so a person must read it.',
  'file that the diff does not show':
    'GitHub lists this file, but the diff does not show its change.',
  'file of the diff that GitHub does not list':
    'The diff shows this file, but GitHub does not list it for the PR.',
  'file outside the usual folders (it can run in CI)':
    'A file in this place can run in the CI run, for example as a config file or a script.',
  'control or non-ASCII character in the path':
    'A path with such characters can hide its real name from a reader.',
  'dotfile or dot folder (a tool can load it as config)':
    'A tool can load a dotfile as its config and run code from it.',
  'package file (npm and Node.js read it)':
    'npm and Node.js read this file, and its scripts can run during an install.',
  'config file (a tool loads it)': 'A tool loads this file and runs its code.',
  'Jest snapshot (Jest runs it as code)':
    'Jest runs the text of a snapshot file as code.',
  'Jest mock folder (Jest loads it without an import)':
    'Jest loads the files of this folder without an import.',
  'code file in cypress/fixtures (Cypress can run it)':
    'Cypress can run a code file of this folder when a test reads it.',
  'file type that the check does not know':
    'The check cannot read this file type, so a person must read it.',
  'symbolic link': 'A link can point to a file outside the usual folders.',
  'submodule entry': 'A submodule brings code from another repository.',
  'executable file': 'An executable file can run as a program.',
  'binary file': 'The check cannot read the content of a binary file.',
  'renamed file': 'A rename can move a file into a place where a tool runs it.',
  'copied file': 'A copy can put a file into a place where a tool runs it.',
  'the path lines of the diff do not agree':
    'The diff names two different paths for one file.',
  [UNREADABLE]:
    'The check cannot read this part of the diff, so a person must read it.',
  'path that the check cannot read':
    'The check cannot read the path of this file.',
  'control or invisible character':
    'A reader cannot see this character, and it can hide code.',
  'non-ASCII character in a code file':
    'A character outside ASCII can look like another character in code.',
  'script or event handler in an SVG file':
    'A browser runs a script in an SVG file.',
  'IP address': 'An IP address can name a server outside the project.',
  [`line longer than ${MAX_LINE_LENGTH} characters`]:
    'A long line can hide code at its end.',
  'URL of another host':
    'The code can send data to a server outside the project.',
  'request to another host': 'The code can send a request to a server.',
  'process or shell': 'The code can start a program or read the environment.',
  'file or system access': 'The code can read or change files or the system.',
  'Node.js module import':
    'A Node.js module gives access to files, programs or the network.',
  'process or network package':
    'This package can start programs or send requests.',
  'dynamic code': 'The code can run code from text.',
  'encoded text': 'Encoded text can hide code or data.',
  'code file that the check cannot read whole':
    'The check needs the whole new file to read this code, and it did not get it.',
  'new file text that does not match the diff':
    'The new file text does not match the diff, so the check cannot use it.',
  'code that the parser cannot read':
    'The parser cannot read this code, so a person must read it.',
  'global name that the check does not allow':
    'This global name can give access to the network, programs or code from text.',
  'use of a root object that the check does not allow':
    'This use of a global object can reach the network, programs or the environment.',
  'import of a file outside the usual folders':
    'The code imports a file from a place where a PR does not normally change files.',
  'import of a package that the check does not allow':
    'The repo does not use this package, and it can do things that the app does not do.',
  'escaped characters in a string':
    'Escaped characters can hide the real text of a string.',
  'Node.js module name in a string':
    'A Node.js module gives access to files, programs or the network.',
  'string joined from constants':
    'A string joined from parts can hide a name from a reader.',
  'escaped characters in a name':
    'Escaped characters can hide the real name of a variable.',
  'constructor chain':
    'A constructor chain can reach the Function constructor and run code from text.',
  'element that can run code': 'This element can load and run code.',
  'code in a string for a timer':
    'A timer with a string runs the string as code.',
  'dynamic import': 'A dynamic import can load code that the check cannot see.',
  'workflow finding of zizmor':
    'zizmor found a weak point that the old workflow file does not have.',
  'zizmor not run': 'zizmor did not check the new workflow file.',
};
const NO_REASON = 'The check has no reason sentence for this rule.';

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

// The text of a result: CLEAN, or REVIEW with each finding.
function formatReport({ findings }) {
  if (!findings.length) return 'CLEAN';
  const files = new Set(findings.map((item) => item.file).filter(Boolean));
  const lines = [
    `REVIEW: ${plural(findings.length, 'finding')} in ${plural(
      files.size,
      'file',
    )}`,
  ];
  findings.forEach((item) => {
    const where = item.file ? printable(item.file) : 'diff';
    const place = item.line ? `${where}:${item.line}` : where;
    const detail = item.detail ? ` (${printable(item.detail)})` : '';
    lines.push(`- ${place}: ${item.rule}${detail}`);
    lines.push(`  Why: ${REASONS[item.rule] ?? NO_REASON}`);
    if (item.text) lines.push(`  Line: ${item.text}`);
  });
  return lines.join('\n');
}

const ZIZMOR_ARGS = [
  '--offline',
  '--no-config',
  '--no-ignores',
  '--persona',
  'auditor',
  '--format',
  'json',
];
const TOKEN_NAMES = ['GH_TOKEN', 'GITHUB_TOKEN', 'ZIZMOR_GITHUB_TOKEN'];

// Run zizmor on one workflow text, with no GitHub token and no network.
// Return its findings, or null when zizmor is not there or gives no list.
function runZizmor(text, filePath) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-pre-check-'));
  try {
    const name = path.basename(filePath);
    const target = filePath.startsWith('.github/actions/')
      ? path.join(folder, '.github', 'actions', 'action', name)
      : path.join(folder, '.github', 'workflows', name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
    const env = { ...process.env };
    TOKEN_NAMES.forEach((token) => delete env[token]);
    const run = spawnSync('zizmor', [...ZIZMOR_ARGS, target], {
      encoding: 'utf8',
      env,
      timeout: 60000,
      maxBuffer: 16 * 1024 * 1024,
    });
    if (run.error) return null;
    const parsed = JSON.parse(run.stdout);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item) => {
      const locations = item.locations ?? [];
      const primary =
        locations.find((location) => location.symbolic?.kind === 'Primary') ??
        locations[0];
      const row = primary?.concrete?.location?.start_point?.row;
      return {
        id: String(item.ident),
        message: [item.desc, primary?.symbolic?.annotation]
          .filter(Boolean)
          .join(': '),
        line: Number.isInteger(row) ? row + 1 : null,
      };
    });
  } catch {
    return null;
  } finally {
    fs.rmSync(folder, { recursive: true, force: true });
  }
}

// A reader of the files in one folder. It reads no file outside the folder
// and no symbolic link, and it gives null for a file that is not there.
function folderReader(folder) {
  const base = path.resolve(folder);
  return (file) => {
    const full = path.resolve(base, file);
    if (!full.startsWith(base + path.sep)) return null;
    try {
      if (!fs.lstatSync(full).isFile()) return null;
      return fs.readFileSync(full, 'utf8');
    } catch {
      return null;
    }
  };
}

const USAGE = `Usage:
  node scripts/pr-pre-check.js --diff <file> [--files <file>] [--new <folder>] [--old <folder>]

  --diff   the unified diff of the PR, for example from "gh pr diff <number>"
  --files  a JSON list of the changed paths that GitHub gives for the PR
  --new    a folder with the whole new text of each changed file
  --old    a folder with the old text of each changed file (for zizmor)

Exit code: 0 for CLEAN, 1 for REVIEW, 2 for a usage error.`;
const OPTIONS = ['--diff', '--files', '--new', '--old'];

function usage(problem) {
  return { exitCode: 2, output: problem ? `${problem}\n\n${USAGE}` : USAGE };
}

function main(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const [name, value] = [args[index], args[index + 1]];
    if (!OPTIONS.includes(name) || value === undefined) return usage();
    options[name.slice(2)] = value;
  }
  if (!options.diff) return usage();
  let diff;
  let files;
  try {
    diff = fs.readFileSync(options.diff, 'utf8');
    files = options.files
      ? JSON.parse(fs.readFileSync(options.files, 'utf8'))
      : undefined;
  } catch (error) {
    return usage(`Cannot read an input file: ${printable(error.message)}`);
  }
  if (
    files !== undefined &&
    !(Array.isArray(files) && files.every((f) => typeof f === 'string'))
  ) {
    return usage('The file list must be a JSON list of paths.');
  }
  const result = preCheck(diff, {
    files,
    readNewFile: options.new ? folderReader(options.new) : undefined,
    readOldFile: options.old ? folderReader(options.old) : undefined,
    zizmor: runZizmor,
  });
  return {
    exitCode: result.verdict === 'clean' ? 0 : 1,
    output: formatReport(result),
  };
}

if (require.main === module) {
  const { exitCode, output } = main(process.argv.slice(2));
  process.stdout.write(`${output}\n`);
  process.exitCode = exitCode;
}

module.exports = { preCheck, formatReport, main };
