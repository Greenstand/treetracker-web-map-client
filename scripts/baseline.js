// Baseline for the static checks (see GLOSSARY: a finding, the baseline).
//
// The baseline file lists the existing findings: for each file, the number of
// findings of each rule. The check fails on each finding that is not in the
// baseline, also on a line that the PR did not change. It also fails when a
// fixed finding is still in the baseline, so the baseline can only shrink.
// The baseline cannot hold a finding with severity "error" or a finding
// without a rule: the check fails on each one, also when the baseline lists
// its file and rule.
// The ESLint baseline has the format of ESLint's eslint-suppressions.json.
//
// Usage:
//   node scripts/baseline.js check [tool ...]     (npm run baseline)
//   node scripts/baseline.js update [tool ...]    (npm run baseline:update)
//   node scripts/baseline.js suppress [tool ...]  (npm run baseline:suppress)
//   node scripts/baseline.js guard <base commit>  (CI only)
//
// check:    fail on new findings and on fixed findings in the baseline.
// update:   remove the fixed findings from the baseline. It never adds one.
// suppress: write all current findings that the baseline can hold. This can
//           grow the baseline, so the PR needs the label "baseline-change".
// guard:    fail when a baseline file has more findings than on the base
//           commit, unless BASELINE_CHANGE_LABEL is "true".
// Without a tool, check, update and suppress use each tool.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function toPosix(file) {
  return file.split(path.sep).join('/');
}

// ESLint gives each message a severity: 1 is a warning, 2 is an error.
const ESLINT_ERROR = 2;

// All ESLint findings of the repo, with the repo's own ESLint config.
async function collectEslint(root) {
  // eslint-disable-next-line global-require -- the guard job runs without npm ci, so load ESLint only for a check
  const { ESLint } = require('eslint');
  const results = await new ESLint({ cwd: root }).lintFiles(['.']);
  return results.flatMap((result) =>
    result.messages.map((message) => ({
      file: toPosix(path.relative(root, result.filePath)),
      rule: message.ruleId,
      line: message.line,
      column: message.column,
      message: message.message,
      severity: message.severity === ESLINT_ERROR ? 'error' : 'warning',
    })),
  );
}

// Each tool has a baseline file and a function that collects its findings.
// The keys of a baseline file are: file path from the repo root, rule, count.
const TOOLS = {
  eslint: {
    title: 'ESLint',
    file: 'eslint-suppressions.json',
    collect: collectEslint,
  },
};

function collectFindings(tool, root) {
  return TOOLS[tool].collect(root);
}

// A problem with a baseline file. The check reports it and fails.
class BaselineError extends Error {}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Reads the text of a baseline file. A volunteer can edit the file by hand,
// so each problem gets a message that names the bad entry.
function parseBaseline(text, file) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new BaselineError(`${file} is not valid JSON. ${error.message}`);
  }
  const invalid = (detail) =>
    new BaselineError(`${file} is not valid. ${detail}`);
  if (!isObject(data)) throw invalid('The top level must be an object.');
  Object.entries(data).forEach(([name, rules]) => {
    if (!isObject(rules)) {
      throw invalid(
        `"${name}" must be an object with one entry for each rule.`,
      );
    }
    Object.entries(rules).forEach(([rule, entry]) => {
      if (
        !isObject(entry) ||
        !Number.isInteger(entry.count) ||
        entry.count < 1
      ) {
        throw invalid(
          `In "${name}", "${rule}" must be { "count": <a whole number above 0> }.`,
        );
      }
    });
  });
  return data;
}

// The baseline of a tool, or null when its file does not exist.
function readBaseline(root, tool) {
  const { file } = TOOLS[tool];
  let text;
  try {
    text = fs.readFileSync(path.join(root, file), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  return parseBaseline(text, file);
}

// Writes the file in the format of ESLint's eslint-suppressions.json: keys in
// sorted order and 2 spaces of indent. The final newline keeps Prettier and
// editors from changing the file.
function writeBaseline(root, tool, baseline) {
  const sorted = {};
  Object.keys(baseline)
    .sort()
    .forEach((file) => {
      sorted[file] = {};
      Object.keys(baseline[file])
        .sort()
        .forEach((rule) => {
          sorted[file][rule] = { count: baseline[file][rule].count };
        });
    });
  fs.writeFileSync(
    path.join(root, TOOLS[tool].file),
    `${JSON.stringify(sorted, null, 2)}\n`,
  );
}

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// The baseline of a tool on a git ref, or null when the ref has no file.
function readBaselineAt(root, ref, tool) {
  const { file } = TOOLS[tool];
  try {
    git(root, ['cat-file', '-e', `${ref}:${file}`]);
  } catch {
    return null;
  }
  return parseBaseline(git(root, ['show', `${ref}:${file}`]), file);
}

// The group of findings without a rule id, for example parse errors. The
// baseline cannot hold them, so each one is new.
const NO_RULE = '(no rule)';

function baselineCount(baseline, file, rule) {
  if (rule === NO_RULE) return 0;
  return baseline[file]?.[rule]?.count ?? 0;
}

// { file: { rule: [finding, ...] } }
function groupFindings(findings) {
  const groups = {};
  findings.forEach((finding) => {
    const rule = finding.rule ?? NO_RULE;
    groups[finding.file] = groups[finding.file] || {};
    groups[finding.file][rule] = groups[finding.file][rule] || [];
    groups[finding.file][rule].push(finding);
  });
  return groups;
}

// A finding with severity "error" blocks a commit (the pre-commit hook) and
// can stop "next build". Neither reads the baseline, so the baseline cannot
// hold the finding, also when the baseline lists its file and rule.
function hasError(findings) {
  return findings.some((finding) => finding.severity === 'error');
}

// Each file and rule with more findings than the baseline allows. The
// baseline has no line numbers, so all findings of the entry are listed.
function newEntries(baseline, groups) {
  return Object.keys(groups)
    .sort()
    .flatMap((file) =>
      Object.keys(groups[file])
        .sort()
        .map((rule) => {
          const findings = groups[file][rule];
          const error = hasError(findings);
          return {
            file,
            rule,
            error,
            before: error ? 0 : baselineCount(baseline, file, rule),
            findings,
          };
        })
        .filter((entry) => entry.findings.length > entry.before),
    );
}

// Each file and rule with fewer findings than the baseline lists.
function fixedEntries(baseline, groups) {
  return Object.keys(baseline)
    .sort()
    .flatMap((file) =>
      Object.keys(baseline[file])
        .sort()
        .map((rule) => ({
          file,
          rule,
          before: baselineCount(baseline, file, rule),
          after: groups[file]?.[rule]?.length ?? 0,
        }))
        .filter((entry) => entry.after < entry.before),
    );
}

// Each file and rule with a higher count after the PR than before it.
function grownEntries(before, after) {
  return Object.keys(after)
    .sort()
    .flatMap((file) =>
      Object.keys(after[file])
        .sort()
        .map((rule) => ({
          file,
          rule,
          before: baselineCount(before, file, rule),
          after: after[file][rule].count,
        }))
        .filter((entry) => entry.after > entry.before),
    );
}

function totalCount(baseline) {
  return Object.values(baseline).reduce(
    (sum, rules) =>
      Object.values(rules).reduce(
        (fileSum, entry) => fileSum + entry.count,
        sum,
      ),
    0,
  );
}

function newTotal(entries) {
  return entries.reduce(
    (sum, entry) => sum + entry.findings.length - entry.before,
    0,
  );
}

function fixedTotal(entries) {
  return entries.reduce((sum, entry) => sum + entry.before - entry.after, 0);
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

// The baseline has no line numbers. When the baseline has some findings of
// the entry, the report cannot tell which of the findings are new.
function entryHeading({ rule, error, before, findings }) {
  if (rule === NO_RULE) {
    return `  ${NO_RULE}: ${findings.length} now. A finding without a rule cannot be in the baseline:`;
  }
  if (error) {
    return `  ${rule}: ${findings.length} now. A finding with severity "error" cannot be in the baseline:`;
  }
  const counts = `  ${rule}: ${before} in the baseline, ${findings.length} now`;
  return before
    ? `${counts}. One or more of these findings is new:`
    : `${counts}:`;
}

function newFindingsReport(tool, entries) {
  const { title, file } = TOOLS[tool];
  const total = newTotal(entries);
  const lines = [`${title}: ${plural(total, 'new finding')}.`];
  entries.forEach((entry, index) => {
    if (index === 0 || entries[index - 1].file !== entry.file) {
      lines.push('', entry.file);
    }
    lines.push(entryHeading(entry));
    entry.findings.forEach((finding) => {
      lines.push(`    ${finding.line}:${finding.column}  ${finding.message}`);
    });
  });
  lines.push(
    '',
    'Fix the new findings. To see them on your computer, run "npm run baseline".',
  );
  // A finding without a rule has its own reason in its heading.
  const withRule = entries.filter((entry) => entry.rule !== NO_RULE);
  if (withRule.some((entry) => !entry.error)) {
    lines.push(
      `If a maintainer agrees to keep a new finding, run "npm run baseline:suppress", commit ${file}, and ask the maintainer to add the label "baseline-change" to the PR.`,
    );
  }
  if (withRule.some((entry) => entry.error)) {
    lines.push(
      'A finding with severity "error" blocks a commit and can stop "next build". Fix it, or change its rule to "warn" in .eslintrc.js.',
    );
  }
  return lines;
}

function fixedPhrase(entries) {
  const total = fixedTotal(entries);
  return `${plural(total, 'fixed finding')} ${total === 1 ? 'is' : 'are'}`;
}

// The edits that remove the fixed findings from the baseline file, for a
// volunteer who cannot run the update command (GitHub web editor).
function handEdits(baseline, entries) {
  const files = [...new Set(entries.map((entry) => entry.file))];
  return files.flatMap((file) => {
    const fileEntries = entries.filter((entry) => entry.file === file);
    const removed = fileEntries.filter((entry) => entry.after === 0);
    if (removed.length === Object.keys(baseline[file]).length) {
      return [`Remove "${file}".`];
    }
    return fileEntries.map((entry) =>
      entry.after === 0
        ? `In "${file}", remove "${entry.rule}".`
        : `In "${file}", set the "count" of "${entry.rule}" to ${entry.after}.`,
    );
  });
}

function fixedFindingsReport(tool, baseline, entries) {
  const { title, file } = TOOLS[tool];
  return [
    `${title}: ${fixedPhrase(entries)} still in the baseline (${file}).`,
    '',
    ...entries.map(
      (entry) =>
        `  ${entry.file}  ${entry.rule}: ${entry.before} in the baseline, ${entry.after} now`,
    ),
    '',
    `Remove the fixed findings from the baseline: run "npm run baseline:update", then commit ${file}.`,
    `Or edit ${file} by hand (for example in the GitHub web editor):`,
    ...handEdits(baseline, entries).map((edit) => `  - ${edit}`),
  ];
}

// GitHub workflow commands: https://docs.github.com/actions/reference/workflow-commands-for-github-actions
function escapeData(text) {
  return String(text)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
}

function escapeProperty(text) {
  return escapeData(text).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

function annotation(properties, message) {
  const list = Object.entries(properties)
    .map(([key, value]) => `${key}=${escapeProperty(value)}`)
    .join(',');
  return `::error ${list}::${escapeData(message)}`;
}

function annotationTitle(title, entry) {
  if (entry.rule === NO_RULE) {
    return `${title} ${NO_RULE}: cannot be in the baseline`;
  }
  if (entry.error) {
    return `${title} ${entry.rule}: severity "error" cannot be in the baseline`;
  }
  return `${title} ${entry.rule}: ${entry.before} in the baseline, ${entry.findings.length} now`;
}

// One annotation on the line of each finding of a new entry. GitHub shows it
// in "Files changed" when the line is part of the PR.
function newFindingsAnnotations(tool, entries) {
  const { title } = TOOLS[tool];
  return entries.flatMap((entry) =>
    entry.findings.map((finding) =>
      annotation(
        {
          file: finding.file,
          line: finding.line,
          col: finding.column,
          title: annotationTitle(title, entry),
        },
        finding.message,
      ),
    ),
  );
}

function check(tool, baseline, groups, env) {
  const { title, file } = TOOLS[tool];
  const added = newEntries(baseline, groups);
  const fixed = fixedEntries(baseline, groups);
  if (!added.length && !fixed.length) {
    return {
      exitCode: 0,
      lines: [
        `${title}: no new findings and no fixed findings (${plural(
          totalCount(baseline),
          'finding',
        )} in the baseline).`,
      ],
    };
  }
  const lines = [];
  if (added.length) lines.push(...newFindingsReport(tool, added));
  if (added.length && fixed.length) lines.push('');
  if (fixed.length) lines.push(...fixedFindingsReport(tool, baseline, fixed));
  if (env.GITHUB_ACTIONS === 'true') {
    lines.push('', ...newFindingsAnnotations(tool, added));
    if (fixed.length) {
      lines.push(
        annotation(
          { title: `${title} baseline` },
          `${fixedPhrase(
            fixed,
          )} still in ${file}. Run "npm run baseline:update" and commit the file, or see the log of this step for the hand edit.`,
        ),
      );
    }
  }
  return { exitCode: 1, lines };
}

// Lowers each count to the current count. It never adds a finding.
function update(tool, root, baseline, groups) {
  const next = {};
  Object.keys(baseline).forEach((file) => {
    Object.keys(baseline[file]).forEach((rule) => {
      const count = Math.min(
        baseline[file][rule].count,
        groups[file]?.[rule]?.length ?? 0,
      );
      if (count > 0) {
        next[file] = next[file] || {};
        next[file][rule] = { count };
      }
    });
  });
  writeBaseline(root, tool, next);
  const { title, file } = TOOLS[tool];
  const removed = fixedTotal(fixedEntries(baseline, groups));
  const lines = [
    removed
      ? `${title}: removed ${plural(removed, 'fixed finding')} from ${file}.`
      : `${title}: no fixed findings to remove from ${file}.`,
  ];
  const added = newTotal(newEntries(baseline, groups));
  if (added) {
    lines.push(
      `${title}: ${plural(added, 'new finding')} ${
        added === 1 ? 'is' : 'are'
      } not in the baseline. The update does not add new findings. To see them, run "npm run baseline".`,
    );
  }
  return { exitCode: 0, lines };
}

// Writes each current finding that the baseline can hold: a finding with a
// rule and without severity "error". This can grow the baseline, so the
// growth guard asks for a maintainer's label.
function suppress(tool, root, groups) {
  const next = {};
  let errors = 0;
  Object.keys(groups).forEach((file) => {
    Object.keys(groups[file])
      .filter((rule) => rule !== NO_RULE)
      .forEach((rule) => {
        const findings = groups[file][rule];
        if (hasError(findings)) {
          errors += findings.length;
          return;
        }
        next[file] = next[file] || {};
        next[file][rule] = { count: findings.length };
      });
  });
  writeBaseline(root, tool, next);
  const { title, file } = TOOLS[tool];
  const lines = [
    `${title}: wrote ${plural(totalCount(next), 'finding')} to ${file}.`,
  ];
  if (errors) {
    lines.push(
      `${title}: ${plural(
        errors,
        'finding',
      )} with severity "error" cannot be in the baseline. To see the findings, run "npm run baseline".`,
    );
  }
  const withoutRule = Object.values(groups).reduce(
    (sum, rules) => sum + (rules[NO_RULE]?.length ?? 0),
    0,
  );
  if (withoutRule) {
    lines.push(
      `${title}: ${plural(
        withoutRule,
        'finding',
      )} without a rule (for example a parse error) cannot be in the baseline. To see the findings, run "npm run baseline".`,
    );
  }
  return { exitCode: 0, lines };
}

// Compares each baseline file of the PR with the file on the base branch.
function guard({ root, env, baseRef }) {
  try {
    git(root, ['rev-parse', '--verify', '--quiet', `${baseRef}^{commit}`]);
  } catch {
    // Without this check, a missing commit looks like a base branch without
    // a baseline file, and the guard passes.
    return {
      exitCode: 1,
      output: `Baseline guard: the base commit "${baseRef}" is not in the checkout. Check out the PR with "fetch-depth: 2".`,
    };
  }
  const labeled = env.BASELINE_CHANGE_LABEL === 'true';
  const notes = [];
  const grown = [];
  Object.keys(TOOLS).forEach((tool) => {
    const before = readBaselineAt(root, baseRef, tool);
    if (!before) {
      notes.push(
        `Baseline guard: the base branch has no ${TOOLS[tool].file}. The guard does not check it.`,
      );
      return;
    }
    const entries = grownEntries(before, readBaseline(root, tool) || {});
    if (entries.length) grown.push({ tool, entries });
  });
  const total = grown.reduce(
    (sum, { entries }) =>
      entries.reduce(
        (toolSum, entry) => toolSum + entry.after - entry.before,
        sum,
      ),
    0,
  );
  if (!total) {
    return {
      exitCode: 0,
      output: [
        ...notes,
        'Baseline guard: the PR adds no findings to the baseline.',
      ].join('\n'),
    };
  }
  const lines = [
    ...notes,
    `Baseline guard: the PR adds ${plural(total, 'finding')} to the baseline.${
      labeled ? ' The label "baseline-change" accepts the growth.' : ''
    }`,
  ];
  grown.forEach(({ tool, entries }) => {
    lines.push('', TOOLS[tool].file);
    entries.forEach((entry) => {
      lines.push(
        `  ${entry.file}  ${entry.rule}: ${entry.before} on the base branch, ${entry.after} in the PR`,
      );
    });
  });
  if (labeled) return { exitCode: 0, output: lines.join('\n') };
  lines.push(
    '',
    'Fix the new findings, and keep them out of the baseline.',
    'If a maintainer agrees to keep them (for example in a PR that adds a new rule), the maintainer adds the label "baseline-change" to the PR. Then this check passes.',
  );
  if (env.GITHUB_ACTIONS === 'true') {
    lines.push(
      '',
      annotation(
        { title: 'Baseline guard' },
        `The PR adds ${plural(
          total,
          'finding',
        )} to the baseline. Fix the new findings, or ask a maintainer to add the label "baseline-change".`,
      ),
    );
  }
  return { exitCode: 1, output: lines.join('\n') };
}

// Turns a problem with a baseline file into a failed result with a message.
async function reportBaselineErrors(prefix, action) {
  try {
    return await action();
  } catch (error) {
    if (!(error instanceof BaselineError)) throw error;
    return { exitCode: 1, output: `${prefix}: ${error.message}` };
  }
}

async function runTool({ mode, tool, root, env, collect = collectFindings }) {
  const { title, file } = TOOLS[tool];
  let baseline = readBaseline(root, tool);
  const lines = [];
  if (!baseline && mode === 'update') {
    return {
      exitCode: 1,
      output: `${title}: the baseline file ${file} does not exist. To make it, run "npm run baseline:suppress".`,
    };
  }
  if (!baseline && mode === 'check') {
    lines.push(
      `${title}: the baseline file ${file} does not exist. Each finding counts as new.`,
      '',
    );
  }
  baseline = baseline || {};
  const groups = groupFindings(await collect(tool, root));
  const modes = {
    check: () => check(tool, baseline, groups, env),
    update: () => update(tool, root, baseline, groups),
    suppress: () => suppress(tool, root, groups),
  };
  const result = modes[mode]();
  lines.push(...result.lines);
  return { exitCode: result.exitCode, output: lines.join('\n') };
}

function run(options) {
  if (options.mode === 'guard') {
    return reportBaselineErrors('Baseline guard', () => guard(options));
  }
  return reportBaselineErrors(TOOLS[options.tool].title, () =>
    runTool(options),
  );
}

const USAGE = `Usage:
  node scripts/baseline.js check|update|suppress [${Object.keys(TOOLS).join(
    '|',
  )} ...]
  node scripts/baseline.js guard <base commit>`;

// One tool after the other, so that the output of each tool stays together.
function main(args) {
  const [mode, ...rest] = args;
  const root = path.resolve(__dirname, '..');
  if (mode === 'guard' && rest.length === 1) {
    return run({ mode, root, env: process.env, baseRef: rest[0] });
  }
  const tools = rest.length ? rest : Object.keys(TOOLS);
  if (
    !['check', 'update', 'suppress'].includes(mode) ||
    tools.some((tool) => !TOOLS[tool])
  ) {
    return Promise.resolve({ exitCode: 2, output: USAGE });
  }
  return tools.reduce(async (previous, tool) => {
    const done = await previous;
    const result = await run({ mode, tool, root, env: process.env });
    return {
      exitCode: Math.max(done.exitCode, result.exitCode),
      output: [done.output, result.output].filter(Boolean).join('\n\n'),
    };
  }, Promise.resolve({ exitCode: 0, output: '' }));
}

if (require.main === module) {
  main(process.argv.slice(2)).then(
    ({ exitCode, output }) => {
      process.stdout.write(`${output}\n`);
      process.exitCode = exitCode;
    },
    (error) => {
      process.stderr.write(`${error.stack}\n`);
      process.exitCode = 2;
    },
  );
}

module.exports = { collectFindings, run };
