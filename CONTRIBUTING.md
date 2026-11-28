# Contributing: the checks on your pull request

Thank you for your help with the web map. This guide tells you which checks run on your pull request (PR), how to run them on your computer, and what to do when one fails. For the project setup, see the [README](README.md). Open your PR against the branch `main`.

In this guide, a **finding** is one problem that a check reports at one place in the code, for example one ESLint warning or one type error.

## The checks

Each push to a PR starts these jobs. They run at the same time. A full run takes about 6 minutes. A new push stops the run of the older commit. Each job has a time limit of 5 to 20 minutes.

| Job                                                    | What it checks                                                                                          | Usual time   | On your computer                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| Run static checks, step "ESLint"                       | The lint rules in `.eslintrc.js`. It fails on each new finding. A fixed finding that is still in the baseline gives a notice. | 1 minute     | `npm run baseline -- eslint`                               |
| Run static checks, step "Type check"                   | Type errors in the `.js` files in `src/`, without the Cypress files (`*.cy.js`). It uses TypeScript `checkJs`. It fails as the step "ESLint" does. | (same job)   | `npm run baseline -- tsc`                                  |
| Run unit tests                                         | The Cypress component tests, then the Jest tests.                                                       | 4 minutes    | `npm run cypress:run:component`, then `npm test` (CI runs `npx jest --ci`) |
| Run integration tests                                  | The Cypress tests of the pages, with a mock API. It saves a screenshot of 7 pages.                      | 6 minutes    | `npm run cypress:run:fast` (stop `npm run dev` first)      |
| Run dependency review                                  | A new runtime dependency with a known high or critical vulnerability.                                   | seconds      | No local command                                           |
| CI passed                                              | All jobs above passed. It fails when one of them failed, was cancelled or did not run. A branch rule can require this one check. | seconds      | No local command                                           |
| Check baseline growth (workflow "Baseline guard")      | The PR does not add findings to a baseline file (see [The baseline](#the-baseline)).                    | seconds      | No local command                                           |

The step "Type check" also runs when the step "ESLint" fails, so you see both results.

All jobs except "Check baseline growth" are in the workflow "CI checks". Each PR gets all checks, also a draft PR and a PR that changes only `.md` files.

The same jobs also run on the branch `main`: after each merge, each night, and when a maintainer starts them. Only "Run dependency review" does not run there. The badge at the top of the [README](README.md) shows the last result on `main`.

## Run the checks before you push

```
npm run baseline
npm test
npm run cypress:run:component
npm run cypress:run:fast
```

`npm run baseline` runs ESLint and the type check. It shows only the new findings and the fixed findings. To see all findings, old and new, run `npm run lint` (ESLint) or `npm run typecheck` (type check). Both list many old findings, and `npm run typecheck` ends with an error. This is normal.

**Integration tests on your computer:** `npm run cypress:run:fast` starts its own Next.js server on port 3000. Stop `npm run dev`, or any other server on port 3000, before you run it. The script uses Electron, the browser that comes with Cypress, and records no videos. CI uses Chrome 156, in the Docker image that `.github/workflows/pull-request-ci.yml` names.

**Node.js version:** use Node.js 20 or later. CI uses Node.js 24. On Node.js 16 and 18, `npm ci` stops with the error "notsup", because some ESLint packages need a newer Node.js.

## The baseline

The code has many old findings. We do not fix them all now. Two files list them: `eslint-suppressions.json` (ESLint) and `tsc-suppressions.json` (type check). This list is the **baseline**. For each file and rule, it records the number of old findings. The check compares these numbers.

- The check fails on each new finding. This includes warnings, and lines that your PR did not change.
- When you fix an old finding and the baseline still lists it, the check passes and gives a notice. Remove the finding from the baseline, so that the baseline stays small (see [Example: a fixed finding](#example-a-fixed-finding)).
- In CI, the check also compares with the findings of the base branch. So a new finding cannot hide behind the count of an old finding that a PR fixed and left in the baseline. To make the same compare on your computer, give the base branch, for example `BASELINE_BASE_REF=upstream/main npm run baseline` (use the name of the remote of the Greenstand repo in your clone, after a `git fetch`).
- When a file has old findings of a rule and you add one more, the log lists all findings of that rule in the file. Find the new one in the list:

  ```
  next.config.js
    no-console: 1 in the baseline, 2 now. One or more of these findings is new:
      92:5  Unexpected console statement.
      93:5  Unexpected console statement.
  ```

### Example: a new finding on lines that you did not change

You change `getLocationString(country, continent)` in `src/models/utils.js` so that it takes one object, `getLocationString({ country, continent })`. The calls in 3 other files still give 2 arguments. The step "Type check" fails:

```
Type check: 5 new findings.

src/components/PlanterQuote.js
  TS2554: 0 in the baseline, 1 now:
    126:17  Expected 0-1 arguments, but got 2.

src/pages/organizations/[organizationid].js
  TS2554: 0 in the baseline, 2 now:
    196:21  Expected 0-1 arguments, but got 2.
    245:23  Expected 0-1 arguments, but got 2.

src/pages/planters/[planterid].js
  TS2554: 0 in the baseline, 2 now:
    282:21  Expected 0-1 arguments, but got 2.
    338:19  Expected 0-1 arguments, but got 2.

Fix the new findings. To see them on your computer, run "npm run baseline".
If a maintainer agrees to keep a new finding, run "npm run baseline:suppress -- tsc", commit tsc-suppressions.json, and ask the maintainer to add the label "baseline-change" to the PR.
```

Change the 5 calls, and the check passes.

### What to do with a new finding

1. **Fix it.** This is the best choice.
2. **Disable the check for one line,** if the code is correct and the check is wrong for this line. Always give a reason.

   - ESLint: name the rule, and give a reason after `--`. A comment without a rule name or without a reason is a new finding.

     ```js
     // eslint-disable-next-line no-console -- the build log needs this line
     ```

   - Type check: put the comment below on the line before the line of the finding (the line number in the log). For a call with too many arguments, TypeScript reports the line of the extra argument, not the line of the call. When the finding goes away, the comment itself becomes a new finding (TS2578), so remove it.

     ```js
     // @ts-expect-error -- the API always sends this field
     ```

3. **Ask a maintainer.** If you cannot fix a finding, say so in the PR description or in a PR comment. If a maintainer agrees to keep it, first fix all other new findings, because the next command writes all current findings to the baseline. Then run `npm run baseline:suppress -- eslint` (or `-- tsc`), commit the baseline file, and ask the maintainer to add the label `baseline-change` to the PR.

### Example: a fixed finding

You remove an old `console.log` line. The step "ESLint" passes and gives a notice, because the baseline still lists the finding:

```
ESLint: 1 fixed finding is still in the baseline (eslint-suppressions.json). This does not fail the check.

  src/models/oidcConfig.js  no-console: 1 in the baseline, 0 now

Remove the fixed findings from the baseline: run "npm run baseline:update", then commit eslint-suppressions.json.
Or edit eslint-suppressions.json by hand (for example in the GitHub web editor):
  - Remove "src/models/oidcConfig.js".
```

Run `npm run baseline:update` and commit the changed file, so that the baseline stays small. This command only removes findings. It never adds one, and it does not fail on a new finding. So run `npm run baseline` again. It must print "no new findings and no fixed findings" for ESLint and for the type check.

### Example: an old count on the base branch

An earlier PR fixed an unused variable in `src/components/Navbar.js` and did not remove it from the baseline. So the baseline file on `main` lists 2 findings of `no-unused-vars` in this file, and the code has 1. Your PR adds one more. On your computer, `npm run baseline` passes, because the baseline file lists 2. In CI, the step "ESLint" compares with the findings of the base branch and fails:

```
ESLint: 1 new finding.

src/components/Navbar.js
  no-unused-vars: 1 allowed (the baseline file lists 2, the base commit has 1), 2 now. One or more of these findings is new:
    22:8  'LoginLogoutToggle' is defined but never used.
    192:7  'unusedHelper' is assigned a value but never used.

Fix the new findings. To see them on your computer, run "npm run baseline".
If a maintainer agrees to keep a new finding, run "npm run baseline:suppress -- eslint", commit eslint-suppressions.json, and ask the maintainer to add the label "baseline-change" to the PR.

The baseline file lists more findings than the base commit has, because a fixed finding stayed in the file. The check allows only the findings of the base commit, so a new finding cannot hide behind the old count.
To keep a new finding of such a file and rule, first remove the old count on the base branch: a maintainer runs "npm run baseline:update" there in a separate PR.
```

Fix the new finding. If you cannot fix it, ask a maintainer, as in [What to do with a new finding](#what-to-do-with-a-new-finding).

### Findings with severity "error"

ESLint gives each finding a severity: `warning` or `error`. A finding with severity `error` cannot be in the baseline. The pre-commit hook blocks a commit with an `error` finding, and an `error` finding can stop `next build`. So the check fails on each `error` finding, also when the baseline lists its file and rule. Fix it:

```
ESLint: 1 new finding.

src/components/Example.js
  eqeqeq: 1 now. A finding with severity "error" cannot be in the baseline:
    3:9  Expected '===' and instead saw '=='.

Fix the new findings. To see them on your computer, run "npm run baseline".
A finding with severity "error" blocks a commit and can stop "next build". Fix it, or change its rule to "warn" in .eslintrc.js.
```

The log also says that you can change the rule to "warn". Do this only when a maintainer agrees, see [For maintainers](#for-maintainers).

### Moved or renamed files

The baseline lists findings by file path. When you move or rename a file that has old findings, the check reports them as new findings at the new path and as fixed findings at the old path. First fix all other new findings. Then run `npm run baseline:suppress -- eslint` (and `-- tsc` if the type check also reports the file), and commit the baseline files. Say in the PR description that you moved the file, and ask a maintainer to add the label `baseline-change`.

## Read a failed check

1. On the PR page, find the failed check, and click **Details**.
2. Open the failed step. The log tells you what failed and what to do.
3. **ESLint and type check:** the log lists each new finding with its file and line. GitHub also shows each new finding in the **Files changed** tab, when the line is part of your PR. A finding in a file that your PR did not change shows only in the run summary.
4. **Cypress tests:** the run summary has files at the bottom, under **Artifacts**. From the integration tests, `cypress-screenshots` has a screenshot of 7 pages (home, top, tree, planter, organization, wallet and token), and `cypress-videos` has the video of each spec file with a failed test. Each page screenshot waits for the map. The map there has a plain blue test background in place of the satellite picture, and the trees of the dev server. When the dev server is slow, a screenshot can miss some tree tiles; the test does not fail for this. From the component tests, `cypress-screenshots-ct` has the screenshots of failed tests, and `cypress-videos-ct` has the videos. The screenshot of a failed test has `(failed)` in its file name. When a job saves no files of a kind, its artifact is not in the list.
5. **Dependency review:** the job summary names the package, the severity and a link to the advisory. The usual fix is a newer version of the package. Old vulnerabilities and dev dependencies do not count. A new GitHub Action in `.github/workflows/` counts as a dependency too.
6. **Check baseline growth:** it fails when your PR adds findings to `eslint-suppressions.json` or `tsc-suppressions.json`. Fix the new findings, or ask a maintainer to add the label `baseline-change`.
7. **CI passed:** it fails when another job of the workflow failed, was cancelled or did not run. Its log names the job. Repair that job; this check then passes.

## Good to know

- **A red check does not block a merge.** A maintainer reads the result and decides. Explain each failure in the PR description.
- **The first run of a new PR can be slower,** because the cache is empty. A Cypress job can log "Unable to reserve cache". This is harmless.
- **Each ESLint run prints "Browserslist: caniuse-lite is outdated".** You can ignore it. Do not run the command that it suggests in your PR, because the command changes `package-lock.json`.
- **CI does not check your commit messages or the PR title.** The local hook checks the commit messages. See [Commit Message and PR Title Format](README.md#commit-message-and-pr-title-format).
- **The pre-commit hook can change your files.** On the staged files, it runs `eslint --fix`, Prettier, and a rewrite of the import paths in `src/`. The commit then has these changes. CI does not run Prettier.
- **Your first PR can wait for an approval.** For a first-time contributor, a maintainer may have to approve the CI run before it starts.
- **A PR that changes a workflow in `.github/workflows` has two rules.** Each `uses:` line needs the full commit SHA of the action, with the version in a comment, for example `uses: owner/action@<full commit SHA> # v1.2.3`. GitHub fails a run that uses an action without a full SHA. Each new workflow needs a `permissions` block. Without one, its token can only read the repo.
- **`package.json` installs TypeScript two times.** `@typescript/native` is TypeScript 7, and it runs the type check. `typescript` is TypeScript 6, because the ESLint plugins need its JavaScript API, and TypeScript 7 does not have one yet. Keep both lines.

## For maintainers

- **Merge only with a green run on the last commit of the PR.** Open the tab "Checks" of the PR. GitHub also shows the button "Merge" for a PR that has no run, or that has a red check.
- **A PR that is behind `main` was tested with an old `main`.** When `main` changed files that the PR uses, get a new run before the merge.
- **How to get a new run:** ask the author for a push, or close and reopen the PR. For a first-time contributor, the run waits for an approval. The workflow "PR pre-check" approves it when the [pre-check result](#the-pre-check-result-on-the-pr) is `CLEAN`. For `REVIEW`, read the findings first, then approve the run.
- **The checks on `main`:** each merge starts them, and a run also starts each night. To start them by hand, use the Actions tab (workflow "CI checks", button "Run workflow", branch `main`), or run `gh workflow run pull-request-ci.yml --ref main`.
- **Do not put `[skip ci]` in a merge commit message.** With it, GitHub starts no workflow for the merge. Then the checks do not run on `main`, and a merge that must make a release makes none. A merge without a release commit type builds and deploys nothing, so it does not need `[skip ci]`.
- **When a run on `main` is red,** repair `main` first. The static checks of each PR can fail on findings that the PR did not add, until `main` is repaired.
- **The commit types of a PR decide the release.** A merge with a `fix`, `feat` or `perf` commit, a revert or a breaking change makes a new version, builds the images and deploys them to dev. A merge with other commit types only (for example `docs`, `ci`, `chore`, `test`) makes no version, builds no image and deploys nothing. Check the commit types before the merge. A deploy to production is the manual workflow "Deploy main channel to prod". See [Releases and Versions](README.md#releases-and-versions).
- `npm run baseline:suppress -- eslint` (or `-- tsc`) writes all current findings that the baseline can hold. Use it only when you agree to keep the new findings, for example in a PR that adds a new rule.
- The label `baseline-change` lets the job "Check baseline growth" pass when a PR adds findings to a baseline file. The job runs again when the label changes. People with the triage role or more can add a label.
- A rule with severity `error` cannot have findings in the baseline. To keep its old findings, change the rule to `warn` in `.eslintrc.js`, run `npm run baseline:suppress -- eslint`, and add the label.
- **Old counts can stay in a baseline file on `main`,** when a PR fixed a finding and did not run `npm run baseline:update`. They hide no new finding, because the check in CI compares with the findings of the base branch. But a PR that must keep a new finding of such a file and rule fails until the old count is gone (see [Example: an old count on the base branch](#example-an-old-count-on-the-base-branch)). Then run `npm run baseline:update` on `main` in a separate PR, and merge it first.

### The pre-check before you approve a CI run

`scripts/pr-pre-check.js` reads the diff of a PR as text and lists each file and each added line that you must read before you approve its CI run. It never runs the code of the PR, and it makes no network request. Run it from a checkout of `main`, because it compares the imports with the packages and the `src` folders of the checkout.

```bash
gh pr diff <number> -R Greenstand/treetracker-web-map-client > pr.diff
node scripts/pr-pre-check.js --diff pr.diff
```

- **`CLEAN`:** no rule found a sign that the PR can misuse its CI run. `CLEAN` does not mean that the code is safe: a rule can miss hidden code.
- **`REVIEW: <n> findings in <m> files`:** read each finding before the approval. Each finding gives the file and the line, the rule, the reason, and the line as printable ASCII. A change of a workflow, a package file, a config file or a script always gives `REVIEW`.
- **A changed code file** needs its whole new text: put the new files into a folder with the same paths and add `--new <folder>`. Without it, each changed code file gets a finding. A new file needs nothing: the diff holds all of it.
- **A changed workflow:** when [zizmor](https://docs.zizmor.sh) is installed, the check shows the zizmor findings that the old file does not have. Add `--old <folder>` with the old files. Without zizmor, the report says "zizmor not run".
- **`--files <file>`** takes the JSON list of the changed paths that GitHub gives for the PR. The check then reports a file that the diff does not show.
- Exit code: 0 for `CLEAN`, 1 for `REVIEW`, 2 for a usage error.
- One approval covers one commit. A new push makes a new waiting run.

### The pre-check result on the PR

The workflow "PR pre-check" (`.github/workflows/pr-pre-check.yml`) runs the pre-check for you. It starts when a run of "CI checks" of a PR from a fork waits for an approval. It reads the changes of the commit whose run waits (not of a newer commit of the PR) through the GitHub API, and it never runs the code of the PR. Then it shows the result on the PR:

- **The label `pre-check: clean` or `pre-check: review`.** Use the labels to find the waiting PRs in the PR list. While the check runs, the PR has no label `pre-check: clean`.
- **The commit status `pre-check`** on the last commit of the PR, with the text `CLEAN` or `REVIEW: <n> findings in <m> files`. The status is green for both results: the text and the label give the result. Its link "Details" opens the run, and the summary of the run lists the findings. The status "error" means that the check did not end: the run shows why.
- **The automatic approval.** For the result `CLEAN`, the workflow approves the waiting runs of "CI checks" and "Baseline guard" of that commit. This is an approval of the CI runs, not a review of the PR. For `REVIEW`, the runs wait: a maintainer reads the findings, then approves the runs (the button "Approve workflows to run" on the PR).
- **What `CLEAN` lets through.** A trick that the pre-check misses runs with no person. Such a run gets no secrets, a token that can only read, and a time limit for each job.
- When GitHub refuses the approval, the job "Approve the waiting runs" of the run is red, and the CI runs wait for a maintainer.
- The result is for one commit. A new push starts the check again.
- For a PR whose run waited before the workflow existed, start the check by hand: `gh workflow run pr-pre-check.yml -R Greenstand/treetracker-web-map-client -f pr=<number>`, or use the Actions tab (workflow "PR pre-check", button "Run workflow"). A `CLEAN` result of a start by hand also approves the waiting runs of the last commit of the PR.
- The workflow starts only for a run of the workflow "CI checks". When you rename that workflow, change the name in `pr-pre-check.yml` too.
- The workflow approves only runs of `pull-request-ci.yml` and `baseline-guard.yml`. When you add a workflow with the trigger `pull_request`, add its file to the job "Approve the waiting runs" in `pr-pre-check.yml`. Until then, its runs wait for a maintainer.

## More in the README

- [Prettier](README.md#prettier), [Eslint](README.md#eslint), [husky](README.md#husky) and [Lint-Staged](README.md#lint-staged)
- [Integration Tests](README.md#integration-tests)
- [Releases and Versions](README.md#releases-and-versions)
- [Workflow with Github](README.md#workflow-with-github)
