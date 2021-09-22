# Treetracker Web Map Site

## Project Description

Displays location and details of all trees that have been tracked in [Greenstand](http://greenstand.org).

Live site is at [www.treetracker.org](https://www.treetracker.org)

**NOTE**

For the new web map site development, we are working on the branch: web-map-site, now we have set it as default branch. 

The current version online is still deployed from master.

## Development Environment Quick Start

1. Make sure all npm modules are installed for client.

```
npm i
```

2. Start the client

```
npm start
```

3. Open the web map in the browser with URL: http://localhost:3000

## Workflow with Github

1. Feel free to pick tasks that interests you in the [issue](/issues) page, and leave some comment on it if you are going to work on it. 

1. We tag issues with:
    * `good first issue`: easy and good for getting started.
    * `medium`: medium difficulty or needs more work.
    * `challenge`: hardest or big tasks, or needs some special skill or tricky or even hack in some way.
    * `documentation`: writing job, sometimes it's good for new dev to learn and do some simple job.
    * `bug`: just bug.
    * `wontfix`: some issue still in discussion, or can not be implemented at current stage, or just outdated problem.
    * `high-priority`: urgent problem, like some crucial bug or feature.
    * We also tag issue with other aspects like the skill needed, the device related and so on.

1. Fork the repo.

1. Coding (In the process, you can rebase/merge the newest code from the main working branch online to get the new changes, check below link to get tutorial on how to update code from upstream)

1. Raise the PR, if possible, add `resolves #xx` in the description to link the PR with the issue, in this way, Github will automatically close that issue for us.

1. If necessary, add some screenshot or video record to show the work, especial when you are doing some UI work, like build a component.

More resource is here: https://app.gitbook.com/@greenstand/s/engineering/tools#github


## Guide for development

### How to Build Components

We recommend using Cypress's component tool to build components separately:

To run Cypress unit/component tests:

```
npm run cyu
```

[Video tutorial for building component](https://loom.com/share/c750be68ecec4a9b99cb6921d2d2e041)


### How to Build Pages/Routes

Glossary: 
  * Page/Route: every unique path of url on the app is a page or route, like a single tree page: `http://map.treetracker/trees/123`.

#### We need to build integration test for every page

We need to build Cypress integration test for every page/route, the integration tests would be run in CI when merge code and deploy to protect app from breaking. 

Also, integration tests bring some benefits for the development workflow, by mocking API requests, we can separately develop every single page, if you'd like to practice Test Driven Develop, you can mock the API and write the tests first, then implement the real page later.

#### To run Cypress integration test

```
npm run cy
```

### How to mock the API

[Video tutorial for mock the API](https://www.loom.com/share/48554f0f67314ea78925a627b2142e1b)


## The API

### The current map API

This repo is the client/site project of treetracker web map, it connects to our server-side api online directly, to get more information about the server side, visit our repo [here](https://github.com/Greenstand/treetracker-web-map-api)

### The in-progress API

On current stage, we got another team working on the new API endpoint, eventually, these API will combine with the map API above to provide a unified API service. The new API spec is evolving, his is the newest API specification:

[/doc/web-map-api.yaml](/doc/web-map-api.yaml)

To check the doc in a convenient way, please import it to some API tools like: http://editor.swagger.io/ or Postman.

#### Using our mock API server

To develop without relying on the in-progress work of API team, we set up a mock API server.

The development mock API server is here: [mock server](https://48b2db50-8226-4f1e-9b46-7d80bed46d0f.mock.pstmn.io).

So you can invoke the API: `/trees/[treeId]` by: `https://48b2db50-8226-4f1e-9b46-7d80bed46d0f.mock.pstmn.io/trees/[treeId]`.

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

## Test

### Glossary

* Unit test: tests against a single class, object, function or file, covering the most small unit in codebase.

* Integration test: test a single piece of functionality in the app, like: a page, a module, a API endpoint.

* End to End test: test the real app like a human being, against real app/environment.

### Philosophy

We encourage Test Driven Development, with tool like Cypress, especially the component tool of Cypress, and the [intercept](https://docs.cypress.io/api/commands/intercept) API, it's been pretty easy to mock and build the case for tests, so we can write the test case first, let the case fail and then implement the real code. 

### Unit test

It's a good practice to code in TDD, but we don't force to write unit test for every unit.

Could use Cypress component test to cover component units. And Jest test to cover model file and utilities function.

### Integration test

We require integration test for every page.

For the front end, every unique page/route is a unit of functionality. 

Use Cypress with intercept API to cover page tests.

### E2E test

We will implement few E2E test to cover most basic workflow, like: visit the root of the website, then jump into the detailed pages.

Use Cypress to cover E2E tests.

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