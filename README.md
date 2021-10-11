**Table of Contents**

- [Treetracker Web Map Site](#treetracker-web-map-site)
	- [Project Description](#project-description)
	- [Development Environment Quick Start](#development-environment-quick-start)
	- [Workflow with Github](#workflow-with-github)
	- [Test Driven Development](#test-driven-development)
		- [Glossary](#glossary)
		- [Test File Naming Conventions](#test-file-naming-conventions)
	- [How to Build Components](#how-to-build-components)
		- [Adding Material UI Theme to Component Tests](#adding-material-ui-theme-to-component-tests)
		- [Using Correct Link Component](#using-correct-link-component)
	- [How to Build Pages/Routes](#how-to-build-pagesroutes)
		- [Integration Tests](#integration-tests)
		- [How to mock the API](#how-to-mock-the-api)
		- [Mocking API calls in NextJs SSR functions](#mocking-api-calls-in-nextjs-ssr-functions)
	- [The API](#the-api)
		- [The current map API](#the-current-map-api)
		- [The in-progress API](#the-in-progress-api)
		- [Using our mock API server](#using-our-mock-api-server)
		- [Config](#config)
	- [The route/URL spec](#the-routeurl-spec)
	- [UI design resource](#ui-design-resource)
	- [Code style guide](#code-style-guide)
		- [Prettier](#prettier)
		- [Eslint](#eslint)
		- [husky](#husky)
		- [Commit Message and PR Title Format](#commit-message-and-pr-title-format)
	- [Other resource from Greenstand](#other-resource-from-greenstand)

# Treetracker Web Map Site

## Project Description

Displays location and details of all trees that have been tracked in [Greenstand](http://greenstand.org).

Live site is at [www.treetracker.org](https://www.treetracker.org)

**NOTE**

For the new web map site development, we are working on the branch: web-map-site, now we have set it as default branch.

The current version online is still deployed from master.

So, for issues, the issue for the new web map site, should use the branch: `web-map-site`, the issue for the current version online, like fix bug, add tiny features, should use `master`, generally, we will freeze new big feature on the `master` branch.

## Development Environment Quick Start

1. Make sure all npm modules are installed for client.

   ```
   npm i
   ```

2. Start the client

   ```
   npm run dev
   ```

3. Start the mock API server

   ```
   npm run mock-server
   ```

   Alternatively you can start the dev server and mock API server with [ concurrently ](https://www.npmjs.com/package/concurrently) using this command:

   ```
   npm run dev:mock
   ```

4. Open the web map in the browser with URL: http://localhost:3000

**Setup for WSL users**

In order to launch Cypress in WSL you will need to have an X-Server running on Windows. [This guide](https://dev.to/nickymeuleman/using-graphical-user-interfaces-like-cypress-in-wsl2-249j) outlines the steps necessary to configure your WSL shell to work with an X-server. If this still isn't working try launching vcxsrv.exe from the command line like this:

```bat
"" "C:\Program Files\VcXsrv\vcxsrv.exe" :0 -multiwindow -clipboard -wgl -ac`
```

## Workflow with Github

1.  Feel free to pick tasks that interests you in the [issue](/issues) page, and leave some comment on it if you are going to work on it.

2.  We tag issues with:

    - `good first issue`: easy and good for getting started.
    - `medium`: medium difficulty or needs more work.
    - `challenge`: hardest or big tasks, or needs some special skill or tricky or even hack in some way.
    - `documentation`: writing job, sometimes it's good for new dev to learn and do some simple job.
    - `bug`: just bug.
    - `wontfix`: some issue still in discussion, or can not be implemented at current stage, or just outdated problem.
    - `high-priority`: urgent problem, like some crucial bug or feature.
    - We also tag issue with other aspects like the skill needed, the device related and so on.

3.  Fork the repo.

4.  Coding (In the process, you can rebase/merge the newest code from the main working branch online to get the new changes, check below link to get tutorial on how to update code from upstream)

5.  Raise the PR, if possible, add `resolves #xx` in the description to link the PR with the issue, in this way, Github will automatically close that issue for us.

6.  If necessary, add some screenshot or video record to show the work, especial when you are doing some UI work, like build a component.

More resource is here: https://app.gitbook.com/@greenstand/s/engineering/tools#github

## Test Driven Development

We encourage Test Driven Development, with tool like Cypress, especially the component tool of Cypress, and the [intercept](https://docs.cypress.io/api/commands/intercept) API, it's been pretty easy to mock and build the case for tests, so we can write the test case first, let the case fail and then implement the real code.

### Glossary

- Unit test: tests against a single class, object, function or file, covering the most small unit in codebase. It's a good practice to code in TDD, but we don't enforce writing a unit test for every unit. Use Cypress component-testing to cover component units and Jest test to cover model file and utility functions.

- Integration test: test a single piece of functionality in the app, like: a page, a module, an API endpoint. We require integration test for every page. Use Cypress for page integration tests

- End to End test: test the real app like a human being, against real app/environment. We will implement few E2E test to cover most basic workflow, like: visit the root of the website, then jump into the detailed pages. Use Cypress to cover E2E tests.

### Test File Naming Conventions

- Component test files should be in the same directory as the test target and have the same name as the test target file with the suffix: `.cy.js`.

- Unit test files should be in the same directory as the test target and have the same name as the test target file with the suffix: `.test.js`.

- Put all integration tests into `/cypress/tests/integration` directory with suffix: `.cy.js`;

- Put all e2e tests into `/cypress/tests/e2e/` directory with suffix: `.cy.js`;

## How to Build Components

We recommend using Cypress's component testing tool to build components in isolation:

**To run Cypress unit/component tests:**

```
npm run cyu
```

[Video tutorial for building component](https://loom.com/share/c750be68ecec4a9b99cb6921d2d2e041)

### Adding Material UI Theme to Component Tests

When developing component tests use the custom `mountWithTheme` function found in `src/models/test-utils.js` instead of the mount function in the `@cypress/react` library. This will include the material-ui theme configuration when rendering your test component in cypress.

### Using Correct Link Component

Do not use `next/link` or `@material-ui/core/Link`. Instead use the custom Link component in `src/components/Link`. This component will ensure that an anchor tag is created with the appropriate href value for SEO purposes.

## How to Build Pages/Routes

Glossary:

- Page/Route: every unique path of url on the app is a page or route, like a single tree page: `http://map.treetracker/trees/123`.

### Integration Tests

We need to build Cypress integration tests for every page/route. The integration tests will be run in CI when merging code and deploying to protect the app from breaking.

Also, integration tests bring some benefits for the development workflow - by mocking API requests we can separately develop every single page. If you'd like to practice Test Driven Development, you can mock the API and write the tests first, then implement the real page later.

**To run Cypress integration tests:**

```
npm run cy
```

**Note**

Cypress will initialize a Nextjs dev server when run in integration mode. This means you do not need to run a local dev/production server before starting cypress.

Cypress Integration testing also includes the `cypress-watch-and-reload` plugin which will restart any loaded tests when you save any changes inside the `src` directory.

### How to mock the API

[Video tutorial for mock the API](https://www.loom.com/share/48554f0f67314ea78925a627b2142e1b)

### Mocking API calls in NextJs SSR functions

API calls made inside nextJs serverless functions like `getServerSideProps()` can be mocked with the nock task we have added to cypress. The following example provides a mock response at the address being fetched during SSR.

```js
beforeEach(() => {
  cy.task('clearNock'); // This will clear any mocks that have been set
});

it('getServerSideProps returns mock', () => {
  const path = `/trees/${tree.id}`;
  const testData = {
    // expected data here
  };

  cy.task('nock', {
    hostname: 'http://127.0.0.1:4010/mock',
    method: 'GET',
    path,
    statusCode: 200,
    body: {
      ...testData,
      status: 200,
    },
  });

  cy.visit(path);
  cy.contains(testData.someValue);
});
```

## The API

### The current map API

This repo is the client/site project of treetracker web map, it connects to our server-side api online directly, to get more information about the server side, visit our repo [here](https://github.com/Greenstand/treetracker-web-map-api)

### The in-progress API

On current stage, we got another team working on the new API endpoint, eventually, these API will combine with the map API above to provide a unified API service. The new API spec is evolving, his is the newest API specification:

[/doc/web-map-api.yaml](/doc/web-map-api.yaml)

To check the doc in a convenient way, please import it to some API tools like: http://editor.swagger.io/ or Postman.

### Using our mock API server

To develop without relying on the in-progress work of API team, we set up a mock API server.

To start the mock API server:

```
npm run mock-server
```

We use [prism](https://github.com/stoplightio/prism/blob/master/docs/guides/01-mocking.md) to mock the API, it read our openAPI spec, and convert to a rest API server.

So if we need to change the mock response, we can modify the mock example in the [spec](/doc/web-map-api.yaml) (those API prefixed with /mock is just for mock purpose) and restart the mock server.

### Config

The config for setting the API server is an env variable, by using `.env`:

```
REACT_APP_API_NEW=https://48b2db50-8226-4f1e-9b46-7d80bed46d0f.mock.pstmn.io/
```

## The route/URL spec

For convenience, we also use openAPI protocol to present the URL spec:

[/doc/web-map-router.yaml](/doc/web-map-router.yaml)

Please import to http://editor.swagger.io to view it.

## UI design resource

Our Figma design resource is here: https://www.figma.com/file/XdYFdjlsHvxehlrkPVYq0l/Greenstand-Webmap?node-id=2497%3A9322

## Code style guide

We use [Prettier](https://prettier.io/), [Eslint](https://eslint.org/) along with [husky](https://typicode.github.io/husky/#/) to style our code.

### Prettier

Prettier reformats the code, but does not do code rule checking. If you are using VSCode as your IDE, please follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code) to set up Prettier and automatically format your code on file save.

You can find the Prettier rules in the .prettierrc file.

### Eslint

To check the coding rules we use Eslint. To validate the rules manually, you must run:

```
npm run lint
```

To fix automatic rules run:

```
npm run lint:fix
```

In .eslintrc.js, there is a set of rules with status **off or warn**. Whenever you are developing a new file or an existing file try to correct some warnings, because in the future the rules will be activated.

Once the rules are activated, you can't make a commit until you fix the lint errors!

You can find the Eslint rules in the .eslintrc.js file.

### husky

With husky we can use any git hook. Git Hooks are actions that can be executed if a certain Git event occurs. For example when a developer makes a 'git commit' or a 'git push'.
To add a command to a pre-commit hook or create a new one, use:

```
npx husky add .husky/pre-commit "<your command>"
```

.husky folder contains all our hooks. E.g.:

```
npx pretty-quick --staged
```

The [pretty-quick](https://www.npmjs.com/package/pretty-quick) npm package runs Prettier on your changed files.

### Commit Message and PR Title Format

We use [commitlint](https://github.com/conventional-changelog/commitlint), to format out commit messages. Commitlint checks if your commit messages meet the conventional commit format.

You need to use a proper commit message format or you will not be able to commit your changes! husky checks your commit messages before every commit.

Your commit messages will need to follow the [Conventional Commits](https://www.conventionalcommits.org/) format, for example:

```
feat: add new button
```

```
chore: run tests on travis ci
```

```
fix(server): send cors headers
```

## Other resource from Greenstand

We have more tech guides and handbook here:

[Greenstand engineer handbook](https://greenstand.gitbook.io/engineering/)
