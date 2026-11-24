# Contributing: the checks on your pull request

Thank you for your help with the web map. This guide tells you which checks run on your pull request (PR), how to run them on your computer, and what to do when one fails. For the project setup, see the [README](README.md). Open your PR against the branch `main`.

In this guide, a **finding** is one problem that a check reports at one place in the code, for example one ESLint warning or one type error.

## The checks

Each push to a PR starts these jobs. They run at the same time. A full run takes about 6 minutes.

| Job                                                    | What it checks                                                                                          | Usual time   | On your computer                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| Run static checks, step "ESLint"                       | The lint rules in `.eslintrc.js`. It fails on each new finding, and on each fixed finding that is still in the baseline. | 1 minute     | `npm run baseline -- eslint`                               |
| Run static checks, step "Type check"                   | Type errors in the `.js` files in `src/`, without the Cypress files (`*.cy.js`). It uses TypeScript `checkJs`. It fails as the step "ESLint" does. | (same job)   | `npm run baseline -- tsc`                                  |
| Run unit tests                                         | The Cypress component tests, then the Jest tests.                                                       | 4 minutes    | `npm run cypress:run:component`, then `npm test` (CI runs `npx jest --ci`) |
| Run integration tests                                  | The Cypress tests of the pages, with a mock API. It saves a screenshot of 7 pages.                      | 6 minutes    | `npm run cypress:run:fast` (stop `npm run dev` first)      |
| Run dependency review                                  | A new runtime dependency with a known high or critical vulnerability.                                   | seconds      | No local command                                           |
| CI passed                                              | All jobs above passed. It fails when one of them failed, was cancelled or did not run. A branch rule can require this one check. | seconds      | No local command                                           |
| Check baseline growth (workflow "Baseline guard")      | The PR does not add findings to a baseline file (see [The baseline](#the-baseline)).                    | seconds      | No local command                                           |

The step "Type check" also runs when the step "ESLint" fails, so you see both results.

All jobs except "Check baseline growth" are in the workflow "API CI for New Pull Requests". Each PR gets all checks, also a draft PR and a PR that changes only `.md` files.

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
- The check also fails when you fix an old finding and the baseline still lists it. So a fixed finding cannot stay in the baseline.
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

You remove an old `console.log` line. The step "ESLint" fails, because the baseline still lists the finding:

```
ESLint: 1 fixed finding is still in the baseline (eslint-suppressions.json).

  src/models/oidcConfig.js  no-console: 1 in the baseline, 0 now

Remove the fixed findings from the baseline: run "npm run baseline:update", then commit eslint-suppressions.json.
Or edit eslint-suppressions.json by hand (for example in the GitHub web editor):
  - Remove "src/models/oidcConfig.js".
```

Run `npm run baseline:update` and commit the changed file. This command only removes findings. It never adds one, and it does not fail on a new finding. So run `npm run baseline` again. It must print "no new findings and no fixed findings" for ESLint and for the type check.

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
4. **Cypress tests:** the run summary has files at the bottom, under **Artifacts**. From the integration tests, `cypress-screenshots` has a screenshot of 7 pages (home, top, tree, planter, organization, wallet and token), and `cypress-videos` has the video of each spec file with a failed test. From the component tests, `cypress-screenshots-ct` has the screenshots of failed tests, and `cypress-videos-ct` has the videos. The screenshot of a failed test has `(failed)` in its file name. When a job saves no files of a kind, its artifact is not in the list.
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
- **`package.json` installs TypeScript two times.** `@typescript/native` is TypeScript 7, and it runs the type check. `typescript` is TypeScript 6, because the ESLint plugins need its JavaScript API, and TypeScript 7 does not have one yet. Keep both lines.

## For maintainers

- **Merge only with a green run on the last commit of the PR.** Open the tab "Checks" of the PR. GitHub also shows the button "Merge" for a PR that has no run, or that has a red check.
- **A PR that is behind `main` was tested with an old `main`.** When `main` changed files that the PR uses, get a new run before the merge.
- **How to get a new run:** ask the author for a push, or close and reopen the PR. For a first-time contributor, read the diff, then approve the run.
- **The checks on `main`:** a merge starts them, but not when the merge commit has `[skip ci]`. After such a merge, start them by hand in the Actions tab (workflow "API CI for New Pull Requests", button "Run workflow", branch `main`), or run `gh workflow run pull-request-ci.yml --ref main`. A run also starts each night.
- **When a run on `main` is red,** repair `main` first. The static checks of each PR can fail on findings that the PR did not add, until `main` is repaired.
- `npm run baseline:suppress -- eslint` (or `-- tsc`) writes all current findings that the baseline can hold. Use it only when you agree to keep the new findings, for example in a PR that adds a new rule.
- The label `baseline-change` lets the job "Check baseline growth" pass when a PR adds findings to a baseline file. The job runs again when the label changes. People with the triage role or more can add a label.
- A rule with severity `error` cannot have findings in the baseline. To keep its old findings, change the rule to `warn` in `.eslintrc.js`, run `npm run baseline:suppress -- eslint`, and add the label.

## More in the README

- [Prettier](README.md#prettier), [Eslint](README.md#eslint), [husky](README.md#husky) and [Lint-Staged](README.md#lint-staged)
- [Integration Tests](README.md#integration-tests)
- [Workflow with Github](README.md#workflow-with-github)
