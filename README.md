**Table of Contents**

- [Treetracker Web Map Beta](#treetracker-web-map-beta)
  - [Project Description](#project-description)
  - [Development Environment Quick Start](#development-environment-quick-start)
  - [Workflow with Github](#workflow-with-github)
  - [Test Driven Development](#test-driven-development)
    - [Glossary](#glossary)
    - [Test File Naming Conventions](#test-file-naming-conventions)
  - [How to Build Components](#how-to-build-components)
    - [Adding Material UI Theme to Component Tests](#adding-material-ui-theme-to-component-tests)
    - [Using Correct Link Component](#using-correct-link-component)
    - [Material UI styles](#material-ui-styles)
    - [Mocking NextJs Router in Component Tests](#mocking-nextjs-router-in-component-tests)
    - [Mocking Static Images](#mocking-static-images)
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
    - [Lint-Staged](#lint-staged)
    - [Commit Message and PR Title Format](#commit-message-and-pr-title-format)
- [Troubleshooting](#troubleshooting)
  - [Can not install Cypress in some area.](#can-not-install-cypress-in-some-area)
  - [Other resource from Greenstand](#other-resource-from-greenstand)

# Treetracker Web Map Beta

## Project Description

Displays location and details of all trees that have been tracked in [Greenstand](http://greenstand.org).

Live site is at [www.treetracker.org](https://www.treetracker.org)

**NOTE**

For the new web map beta development, we are working on the branch: beta, now we have set it as default branch.

The current version online is still deployed from master.

So, for issues, the issue for the new web map beta, should use the branch: `beta`, the issue for the current version online, like fix bug, add tiny features, should use `master`, generally, we will freeze new big feature on the `master` branch.

## Development Environment Quick Start

This project must be installed and used with Node v16. [Node Version Manager](https://github.com/nvm-sh/nvm) is an excellent tool for quickly installing and selecting Node releases.

1. Make sure all npm modules are installed for client.

   ```
   npm i
   ```

2. Start the client

   ```
   npm run dev
   ```

3. Open the web map in the browser with URL: http://localhost:3000

**Setup for WSL users**

In order to launch Cypress in WSL you will need to have an X-Server running on Windows. [This guide](https://dev.to/nickymeuleman/using-graphical-user-interfaces-like-cypress-in-wsl2-249j) outlines the steps necessary to configure your WSL shell to work with an X-server. If this still isn't working try launching vcxsrv.exe from the command line like this:

WSL 1

```bat
start "" "C:\Program Files\VcXsrv\vcxsrv.exe" :0 -multiwindow -clipboard -wgl`
```

WSL 2

```bat
start "" "C:\Program Files\VcXsrv\vcxsrv.exe" :0 -multiwindow -clipboard -wgl -ac`
```

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

**NOTE** if you met : `not test found` problem, check this issue for fixing: [issue229](https://github.com/Greenstand/treetracker-web-map-client/issues/229)

### Adding Material UI Theme to Component Tests

When developing component tests use the custom `mountWithTheme` function found in `src/models/test-utils.js` instead of the mount function in the `@cypress/react` library. This will include the material-ui theme configuration when rendering your test component in cypress.

### Using Correct Link Component

Do not use `next/link` or `@mui/material/Link`. Instead use the custom Link component in `src/components/Link`. This component will ensure that an anchor tag is created with the appropriate href value for SEO purposes. If your component uses this Link component then you will need to include router mocking for component tests to pass.

### CSS/Material-UI Guideline

https://greenstand.gitbook.io/wallet-web-app/css-and-materialui-guideline

### Material UI styles

Use Material UI's [sx prop](https://mui.com/system/the-sx-prop/) to style your components. `tss-react` is included for maintaining backwards compatibility with the legacy code base.

### Mocking NextJs Router in Component Tests

Use the custom `mountWithThemeAndRouter` function found in `src/models/test-utils.js` instead of the `mountWithTheme` function. This will include a basic router context mock to allow component tests to pass.

### Mocking Static Images

If your component uses a static image file then you will need to mock it in your component tests. Place the following code in your test file. Replace the fixture value with the path to an example image in the `cypress/fixtures` directory.

```js
beforeEach(() => {
  cy.intercept('/_next/**', {
    fixture: 'images/greenstand_logo_full.png',
  });
});
```

## How to Build Pages/Routes

Glossary:

- Page/Route: every unique path of url on the app is a page or route, like a single tree page: `http://map.treetracker/trees/123`.

### Integration Tests

We need to build Cypress integration tests for every page/route. The integration tests will be run in CI when merging code and deploying to protect the app from breaking.

Also, integration tests bring some benefits for the development workflow - by mocking API requests we can separately develop every single page. If you'd like to practice Test Driven Development, you can mock the API and write the tests first, then implement the real page later.

**To run Cypress integration tests:**

Open cypress test viewer

```
npm run cypress:open
```

Nextjs dev server + Cypress test viewer

```
npm run cy
```

Nextjs dev server + Cypress test viewer + nock

```
npm run cy:nock
```

Run cypress tests headless

```
npm run cypress:run
```

Nextjs dev server + Cypress run headless + nock + skip video recording

```
npm run cypress:run:fast
```

**Note**

Cypress Integration testing also includes the `cypress-watch-and-reload` plugin which will restart any loaded tests when you save any changes inside the `src` directory.

### How to mock the API

[Video tutorial for mock the API](https://www.loom.com/share/48554f0f67314ea78925a627b2142e1b)

### Mocking API calls in cypress tests

NextJS deploys with a nodejs server and API calls can be made from this server or from the client viewing the webpage. Client-side API calls can be mocked by Cypress normally with the `cy.intercept()` method like this:

```js
cy.intercept('GET', '**/countries/**', {
  statusCode: 200,
  body: leaders,
});
```

Server-side API calls in NextJs must occur within a `getServerSideProps()` page function or from files in the `pages/api/` folder. These API calls can be mocked with the nock task we have added to cypress. The following example provides a mock response at the address being fetched during SSR.

**Note**

Cypress must start a custom Nextjs server to mock SSR functions. Use `cypress open --env nock=true` or `npm run cy:nock` to start cypress with a Nextjs server (this means you do not need to use `npm run dev` or `npm start`). You can use `Cypress.env('nock')` in your test files to check if the cypress nextjs server is active.

```js
import tree from '../../fixtures/tree186734.json';

beforeEach(() => {
  // This will clear any mocks that have been set
  Cypress.env('nock') && cy.task('clearNock');
});

it('getServerSideProps returns mock', () => {
  const path = `/trees/${tree.id}`;

  Cypress.env('nock') &&
    cy.task('nock', {
      hostname: Cypress.env('NEXT_PUBLIC_API')
      method: 'GET',
      path,
      statusCode: 200,
      body: tree,
    });

  cy.visit(path);
  cy.contains(testData.someValue);
});
```

## The API

### The current map API

https://github.com/Greenstand/treetracker-query-api

### Mocking the API in development

Start the dev server with msw enabled:

```
npm run dev:mock
```

[msw](https://mswjs.io) is used for mocking API calls during development and for jest tests. To enable it use the following env var ` NEXT_PUBLIC_API_MOCKING=enabled` or use the `dev:mock` script. If a new API route needs to be added use the `src/mocks/handlers.js` file.

## The route/URL spec

For convenience, we also use openAPI protocol to present the URL spec:

[/doc/web-map-router.yaml](/doc/web-map-router.yaml)

Please import to http://editor.swagger.io to view it.

## UI design resource

Our Figma design resource is here: https://www.figma.com/file/XdYFdjlsHvxehlrkPVYq0l/Greenstand-Webmap?node-id=2497%3A9322

Make sure you are logged in to Figma so that you can inspect the style details in Figma's editor.

## Design Sandbox

To access the projects design sandbox, please run Cypress unit/component tests:

```
npm run cyu
```

Open DesignSandbox.cy.js test file in the component test browser. located in the DesignSandbox folder. This component will have a color swatch, background swatch, and all the necessary typography information that matches the project's design file.

As we now have a dark theme, when working with text colors use the correct ones. We have colors that are dynamic based on the theme, and we have colors that are NOT dynamic that can be used for components with a background that does not change based on the theme.

Please use colors from MUI's theme when working on the style of the project for better maintainability, at readability. DO NOT write colors manually!

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

With husky we can use any git hook. Git Hooks are actions that can be executed if a certain Git event occurs. For example when a developer makes a 'git commit' or a 'git push'. Pre-commit hooks are listed in `.husky/pre-commit`

### Lint-Staged

[Lint-staged](https://github.com/okonet/lint-staged) is used with husky to run actions exclusively on staged files. This allows us to lint staged files and automatically add fixes to the commit.

### Commit Message and PR Title Format

We use [commitlint](https://github.com/conventional-changelog/commitlint), to format our commit messages. Commitlint checks if your commit messages meet the conventional commit format.

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

# Troubleshooting

## Can not install Cypress in some area.

In some area like China, there might be some problem with installing the Cypress, throws error log like this:

```
npm ERR! URL: https://download.cypress.io/desktop/8.6.0?platform=darwin&arch=x64
npm ERR! Error: read ECONNRESET
```

To sole this problem, download the zip file directly from Cypress CDN following guide here: https://docs.cypress.io/guides/getting-started/installing-cypress#Direct-download

Then install the project with a env variable:

```
CYPRESS_INSTALL_BINARY=[path/to/Cypress/zip/file] npm ci
```

## Other resource from Greenstand

We have more tech guides and handbook here:

[Greenstand engineer handbook](https://greenstand.gitbook.io/engineering/)

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
6.  Optional, if you haven't fully conficence about your code, it's always a good idea that create a PR in `draft` status as early as possible, so you can draw others attention on it and give you suggestions. (to do it, just expand the PR button, there is a `draft` selection)

7.  If necessary, add some screenshot or video record to show the work, especial when you are doing some UI work, like build a component.

More resource is here: https://app.gitbook.com/@greenstand/s/engineering/tools#github
.
