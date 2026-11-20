/**
 * @jest-environment node
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { collectFindings, run } = require('./baseline');

const BASELINE_FILE = 'eslint-suppressions.json';

const roots = [];

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'baseline-test-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  roots.splice(0).forEach((root) => {
    fs.rmSync(root, { recursive: true, force: true });
  });
});

function writeBaseline(root, baseline) {
  fs.writeFileSync(path.join(root, BASELINE_FILE), JSON.stringify(baseline));
}

function finding(file, rule, line = 1) {
  return { file, rule, line, column: 1, message: `Message of ${rule}.` };
}

function runMode(mode, root, findings, env = {}) {
  return run({ mode, tool: 'eslint', root, env, collect: () => findings });
}

describe('check', () => {
  it('passes and gives the count when each finding is in the baseline', async () => {
    const root = makeRoot();
    writeBaseline(root, {
      'src/a.js': { 'no-unused-vars': { count: 2 } },
    });

    const result = await runMode('check', root, [
      finding('src/a.js', 'no-unused-vars', 3),
      finding('src/a.js', 'no-unused-vars', 9),
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.output).toBe(
      'ESLint: no new findings and no fixed findings (2 findings in the baseline).',
    );
  });

  it('fails on a new finding and shows each finding of its file and rule', async () => {
    const root = makeRoot();
    writeBaseline(root, {
      'src/a.js': { 'no-unused-vars': { count: 1 } },
    });

    const result = await runMode('check', root, [
      finding('src/a.js', 'no-unused-vars', 3),
      finding('src/a.js', 'no-unused-vars', 9),
      finding('src/b.js', 'no-console', 4),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('ESLint: 2 new findings.');
    expect(result.output).toContain(
      [
        'src/a.js',
        '  no-unused-vars: 1 in the baseline, 2 now. One or more of these findings is new:',
        '    3:1  Message of no-unused-vars.',
        '    9:1  Message of no-unused-vars.',
      ].join('\n'),
    );
    expect(result.output).toContain(
      [
        'src/b.js',
        '  no-console: 0 in the baseline, 1 now:',
        '    4:1  Message of no-console.',
      ].join('\n'),
    );
  });

  it('says how to fix a new finding, and how a maintainer can accept it', async () => {
    const root = makeRoot();
    writeBaseline(root, {});

    const result = await runMode('check', root, [
      finding('src/b.js', 'no-console'),
    ]);

    expect(result.output).toContain(
      [
        'Fix the new findings. To see them on your computer, run "npm run baseline".',
        'If a maintainer agrees to keep a new finding, run "npm run baseline:suppress", commit eslint-suppressions.json, and ask the maintainer to add the label "baseline-change" to the PR.',
      ].join('\n'),
    );
  });

  it('adds an annotation on the line of each new finding, only on GitHub', async () => {
    const root = makeRoot();
    writeBaseline(root, {});
    const findings = [
      {
        file: 'src/b.js',
        rule: 'no-console',
        line: 4,
        column: 2,
        message: 'Bad 100% value,\nsecond line',
      },
    ];

    const onGitHub = await runMode('check', root, findings, {
      GITHUB_ACTIONS: 'true',
    });
    const local = await runMode('check', root, findings);

    expect(onGitHub.output).toContain(
      '\n::error file=src/b.js,line=4,col=2,title=ESLint no-console%3A 0 in the baseline%2C 1 now::Bad 100%25 value,%0Asecond line',
    );
    expect(local.output).not.toContain('::error');
  });

  it('adds one summary annotation for fixed findings on GitHub', async () => {
    const root = makeRoot();
    writeBaseline(root, { 'src/a.js': { 'no-console': { count: 1 } } });

    const result = await runMode('check', root, [], { GITHUB_ACTIONS: 'true' });

    expect(result.output).toContain(
      '\n::error title=ESLint baseline::1 fixed finding is still in eslint-suppressions.json. Run "npm run baseline:update" and commit the file, or see the log of this step for the hand edit.',
    );
  });

  it('fails on a finding without a rule, such as a parse error', async () => {
    const root = makeRoot();
    writeBaseline(root, {});

    const result = await runMode('check', root, [
      {
        file: 'src/x.js',
        rule: null,
        line: 5,
        column: 3,
        message: 'Parsing error: Unexpected token',
      },
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.output).toContain(
      [
        'src/x.js',
        '  (no rule): 1 now. A finding without a rule cannot be in the baseline:',
        '    5:3  Parsing error: Unexpected token',
      ].join('\n'),
    );
  });

  it('counts each finding as new when the baseline file does not exist', async () => {
    const root = makeRoot();

    const result = await runMode('check', root, [
      finding('src/b.js', 'no-console'),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.output).toMatch(
      /^ESLint: the baseline file eslint-suppressions\.json does not exist\. Each finding counts as new\.\n\nESLint: 1 new finding\./,
    );
  });

  it('fails with a clear message when the baseline file is not valid JSON', async () => {
    const root = makeRoot();
    fs.writeFileSync(path.join(root, BASELINE_FILE), '{ "src/a.js": { ');

    const result = await runMode('check', root, []);

    expect(result.exitCode).toBe(1);
    expect(result.output).toMatch(
      /^ESLint: eslint-suppressions\.json is not valid JSON\. .+/,
    );
  });

  it('fails with a clear message when a baseline entry has no valid count', async () => {
    const root = makeRoot();
    writeBaseline(root, { 'src/a.js': { 'no-console': { count: 0 } } });

    const result = await runMode('check', root, []);

    expect(result.exitCode).toBe(1);
    expect(result.output).toBe(
      'ESLint: eslint-suppressions.json is not valid. In "src/a.js", "no-console" must be { "count": <a whole number above 0> }.',
    );
  });

  it('fails on a fixed finding that is still in the baseline, and says how to remove it', async () => {
    const root = makeRoot();
    writeBaseline(root, {
      'src/a.js': { 'no-unused-vars': { count: 2 } },
      'src/c.js': { 'no-alert': { count: 1 }, 'no-console': { count: 1 } },
      'src/d.js': { 'no-console': { count: 1 } },
    });

    const result = await runMode('check', root, [
      finding('src/a.js', 'no-unused-vars'),
      finding('src/c.js', 'no-alert'),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.output).toContain(
      [
        'ESLint: 3 fixed findings are still in the baseline (eslint-suppressions.json).',
        '',
        '  src/a.js  no-unused-vars: 2 in the baseline, 1 now',
        '  src/c.js  no-console: 1 in the baseline, 0 now',
        '  src/d.js  no-console: 1 in the baseline, 0 now',
        '',
        'Remove the fixed findings from the baseline: run "npm run baseline:update", then commit eslint-suppressions.json.',
        'Or edit eslint-suppressions.json by hand (for example in the GitHub web editor):',
        '  - In "src/a.js", set the "count" of "no-unused-vars" to 1.',
        '  - In "src/c.js", remove "no-console".',
        '  - Remove "src/d.js".',
      ].join('\n'),
    );
  });
});

function readBaselineText(root) {
  return fs.readFileSync(path.join(root, BASELINE_FILE), 'utf8');
}

describe('update', () => {
  it('removes the fixed findings and never adds a new finding', async () => {
    const root = makeRoot();
    writeBaseline(root, {
      'src/d.js': { 'no-console': { count: 1 } },
      'src/c.js': { 'no-console': { count: 1 }, 'no-alert': { count: 1 } },
      'src/a.js': { 'no-unused-vars': { count: 2 } },
    });

    const result = await runMode('update', root, [
      finding('src/a.js', 'no-unused-vars'),
      finding('src/c.js', 'no-alert'),
      finding('src/b.js', 'no-console'),
      { file: 'src/x.js', rule: null, line: 1, column: 1, message: 'Parse' },
    ]);

    expect(result.exitCode).toBe(0);
    expect(readBaselineText(root)).toBe(`{
  "src/a.js": {
    "no-unused-vars": {
      "count": 1
    }
  },
  "src/c.js": {
    "no-alert": {
      "count": 1
    }
  }
}
`);
  });

  it('does not make a baseline file when none exists', async () => {
    const root = makeRoot();

    const result = await runMode('update', root, [
      finding('src/b.js', 'no-console'),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.output).toBe(
      'ESLint: the baseline file eslint-suppressions.json does not exist. To make it, run "npm run baseline:suppress".',
    );
    expect(fs.existsSync(path.join(root, BASELINE_FILE))).toBe(false);
  });

  it('reports the removed findings and the new findings that it did not add', async () => {
    const root = makeRoot();
    writeBaseline(root, { 'src/a.js': { 'no-unused-vars': { count: 2 } } });

    const result = await runMode('update', root, [
      finding('src/b.js', 'no-console'),
      { file: 'src/x.js', rule: null, line: 1, column: 1, message: 'Parse' },
    ]);

    expect(result.output).toBe(
      [
        'ESLint: removed 2 fixed findings from eslint-suppressions.json.',
        'ESLint: 2 new findings are not in the baseline. The update does not add new findings. To see them, run "npm run baseline".',
      ].join('\n'),
    );
  });
});

describe('suppress', () => {
  it('writes each current finding with a rule to the baseline', async () => {
    const root = makeRoot();
    writeBaseline(root, {
      'src/z.js': { 'no-alert': { count: 1 } },
      'src/a.js': { 'no-unused-vars': { count: 3 } },
    });

    const result = await runMode('suppress', root, [
      finding('src/c.js', 'no-console', 1),
      finding('src/c.js', 'no-console', 2),
      finding('src/a.js', 'no-unused-vars'),
      finding('src/a.js', 'import/order'),
      { file: 'src/x.js', rule: null, line: 1, column: 1, message: 'Parse' },
    ]);

    expect(result.exitCode).toBe(0);
    expect(readBaselineText(root)).toBe(`{
  "src/a.js": {
    "import/order": {
      "count": 1
    },
    "no-unused-vars": {
      "count": 1
    }
  },
  "src/c.js": {
    "no-console": {
      "count": 2
    }
  }
}
`);
  });

  it('makes the baseline file when none exists, and reports what it wrote', async () => {
    const root = makeRoot();

    const result = await runMode('suppress', root, [
      finding('src/c.js', 'no-console'),
      { file: 'src/x.js', rule: null, line: 1, column: 1, message: 'Parse' },
    ]);

    expect(result.output).toBe(
      [
        'ESLint: wrote 1 finding to eslint-suppressions.json.',
        'ESLint: 1 finding without a rule (for example a parse error) cannot be in the baseline. To see the findings, run "npm run baseline".',
      ].join('\n'),
    );
    expect(fs.existsSync(path.join(root, BASELINE_FILE))).toBe(true);
  });
});

// A git repo with two commits: the base branch, then the PR. A null baseline
// means that the commit has no baseline file.
function makeRepo(baseBaseline, prBaseline) {
  const root = makeRoot();
  const git = (...args) =>
    execFileSync('git', ['-C', root, '-c', 'commit.gpgsign=false', ...args], {
      stdio: 'pipe',
    });
  const commit = (baseline, message) => {
    const file = path.join(root, BASELINE_FILE);
    if (baseline) writeBaseline(root, baseline);
    else fs.rmSync(file, { force: true });
    fs.writeFileSync(path.join(root, 'commit.txt'), message);
    git('add', '--all');
    git(
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      'commit',
      '--quiet',
      '--no-verify',
      '--message',
      message,
    );
  };
  git('init', '--quiet');
  commit(baseBaseline, 'base');
  commit(prBaseline, 'pr');
  return root;
}

function guard(root, env = {}) {
  return run({ mode: 'guard', root, env, baseRef: 'HEAD^1' });
}

describe('guard', () => {
  it('fails when the PR adds findings to the baseline', async () => {
    const root = makeRepo(
      { 'src/a.js': { 'no-console': { count: 1 } } },
      {
        'src/a.js': { 'no-console': { count: 2 } },
        'src/b.js': { 'no-alert': { count: 1 } },
      },
    );

    const result = await guard(root);

    expect(result.exitCode).toBe(1);
    expect(result.output).toBe(
      [
        'Baseline guard: the PR adds 2 findings to the baseline.',
        '',
        'eslint-suppressions.json',
        '  src/a.js  no-console: 1 on the base branch, 2 in the PR',
        '  src/b.js  no-alert: 0 on the base branch, 1 in the PR',
        '',
        'Fix the new findings, and keep them out of the baseline.',
        'If a maintainer agrees to keep them (for example in a PR that adds a new rule), the maintainer adds the label "baseline-change" to the PR. Then this check passes.',
      ].join('\n'),
    );
  });

  it('adds an annotation with the reason on GitHub', async () => {
    const root = makeRepo(
      { 'src/a.js': { 'no-console': { count: 1 } } },
      { 'src/a.js': { 'no-console': { count: 2 } } },
    );

    const result = await guard(root, { GITHUB_ACTIONS: 'true' });

    expect(result.output).toContain(
      '\n::error title=Baseline guard::The PR adds 1 finding to the baseline. Fix the new findings, or ask a maintainer to add the label "baseline-change".',
    );
  });

  it('passes when the PR removes findings or keeps the baseline as it is', async () => {
    const root = makeRepo(
      {
        'src/a.js': { 'no-console': { count: 2 } },
        'src/b.js': { 'no-alert': { count: 1 } },
        'src/c.js': { 'no-alert': { count: 1 } },
      },
      {
        'src/a.js': { 'no-console': { count: 1 } },
        'src/c.js': { 'no-alert': { count: 1 } },
      },
    );

    const result = await guard(root);

    expect(result.exitCode).toBe(0);
    expect(result.output).toBe(
      'Baseline guard: the PR adds no findings to the baseline.',
    );
  });

  it('passes on growth when the PR has the label baseline-change', async () => {
    const root = makeRepo(
      { 'src/a.js': { 'no-console': { count: 1 } } },
      { 'src/a.js': { 'no-console': { count: 2 } } },
    );

    const result = await guard(root, { BASELINE_CHANGE_LABEL: 'true' });

    expect(result.exitCode).toBe(0);
    expect(result.output).toBe(
      [
        'Baseline guard: the PR adds 1 finding to the baseline. The label "baseline-change" accepts the growth.',
        '',
        'eslint-suppressions.json',
        '  src/a.js  no-console: 1 on the base branch, 2 in the PR',
      ].join('\n'),
    );
  });

  it('passes when the base branch has no baseline file yet', async () => {
    const root = makeRepo(null, {
      'src/a.js': { 'no-console': { count: 1 } },
    });

    const result = await guard(root);

    expect(result.exitCode).toBe(0);
    expect(result.output).toBe(
      [
        'Baseline guard: the base branch has no eslint-suppressions.json. The guard does not check it.',
        'Baseline guard: the PR adds no findings to the baseline.',
      ].join('\n'),
    );
  });

  it('fails when the base commit is not in the checkout', async () => {
    const root = makeRepo(
      { 'src/a.js': { 'no-console': { count: 1 } } },
      { 'src/a.js': { 'no-console': { count: 2 } } },
    );

    const result = await run({
      mode: 'guard',
      root,
      env: {},
      baseRef: 'HEAD~2',
    });

    expect(result.exitCode).toBe(1);
    expect(result.output).toBe(
      'Baseline guard: the base commit "HEAD~2" is not in the checkout. Check out the PR with "fetch-depth: 2".',
    );
  });

  it('fails with a clear message when the baseline file of the PR is not valid', async () => {
    const root = makeRepo(
      { 'src/a.js': { 'no-console': { count: 1 } } },
      { 'src/a.js': { 'no-console': { count: 1 } } },
    );
    fs.writeFileSync(path.join(root, BASELINE_FILE), '{ "src/a.js": ');

    const result = await guard(root);

    expect(result.exitCode).toBe(1);
    expect(result.output).toMatch(
      /^Baseline guard: eslint-suppressions\.json is not valid JSON\. .+/,
    );
  });
});

describe('ESLint findings', () => {
  it('gives each finding with its path from the root and its rule', async () => {
    const root = makeRoot();
    fs.mkdirSync(path.join(root, 'src'));
    fs.writeFileSync(
      path.join(root, '.eslintrc.json'),
      JSON.stringify({
        root: true,
        rules: { 'no-console': 'warn', 'no-debugger': 'error' },
      }),
    );
    fs.writeFileSync(
      path.join(root, 'src', 'a.js'),
      'console.log(1);\n  debugger;\n',
    );
    fs.writeFileSync(path.join(root, 'src', 'bad.js'), 'var = 1;\n');

    const findings = await collectFindings('eslint', root);

    expect(findings).toEqual([
      {
        file: 'src/a.js',
        rule: 'no-console',
        line: 1,
        column: 1,
        message: 'Unexpected console statement.',
      },
      {
        file: 'src/a.js',
        rule: 'no-debugger',
        line: 2,
        column: 3,
        message: "Unexpected 'debugger' statement.",
      },
      {
        file: 'src/bad.js',
        rule: null,
        line: 1,
        column: 5,
        message: 'Parsing error: Unexpected token =',
      },
    ]);
  });
});
