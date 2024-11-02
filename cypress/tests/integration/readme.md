# How to write Cypress Integration Tests {#intro}

---

## Where are the integration test files? {#test-dir}

---

Within the root,`cypress/test/integration`. Depending on what units you are testing make a new directory with the appropriate name.

---

## File Naming Convention {#naming}

---

When making an integration test file, Be sure to name it `**.cy.js`. [^1] This file extension name allows cypress to recognize the file as a cypress test.

---

## File Placement {#files}

---

When adding a new integration test, ensure that the test is moved within the `integration` directory.

If it is not present within `integration`, It will not be considered an integration test by Cypress.

---

## Utilize Existing Best Practices {#review}

---

After successfully writing your first integration test in Cypress, It is a good idea to revise it using current best practices. [^2]

---

## What is nockIntercept? Where does it come from in codebase?

---

nock is the way mock API calls in next for development mode.

In the codebase, nockIntercept comes from `cypress/plugins/index.js`. I highly recommend reading the source code to have a better understanding of how it works.

---

## Setup for integration testing {#setup}

---

1. import prepareNocks and clearNocks

2. import the required fixtures[^3] into your test as well from either `cypress/fixtures` or `doc/examples`

3. setup a `beforeEach` hook that invokes `clearNocks` before each test [^2].

4. Make a test (with multiple assertions) that completes a task that involves the interaction of many units/modules [^2]

Note: Read the `getNockRoutes` to see which routes are usable for `prepareNocks` method.
`cypress/tests/integration/nockRoutes.js`

---

## Practice: Setup a Money Tree integration test {#practice}

---

_Prerequisite: a fork of the web-map-client repo_

1. Make a new file within `cypress/test/integration` called `money_tree.cy.js`

2. Make a default import for the `tree186734.json` file from `fixtures` directory within `money_tree.cy.js`

note: We are testing for a specific tree so we need to data about trees from fixtures. This is the same logic used in the other integration tests.

3. Make 2 named imports for `prepareNocks` and `clearNocks`
   [^4]

4. Setup a `beforeEach` hook that invokes `clearNocks` [^2]

```
beforeEach(()=>{
    clearNocks();
});
```

5. Make a variable that contains the path for the route you want to call. In our case, `/trees/${tree.id}`[^4][^5]

6. Use prepareNocks to prepare mockAPI data[^4]

```
prepareNocks({
    //my default import for tree fixture is called 'tree'
    // goal: make a tree that has a name called 'money tree'
    tree: {...tree, species_name: "money tree" }
})
```

7. Use cy.task - 'nockIntercept' to mock up an API request for a specific path

```
// You must pass in the hostname, method, path, statusCode, and body for 'nockIntercept' task
// the host name is the same for development mode
cy.task('nockIntercept', {
hostname: 'https://dev-k8s.treetracker.org',
method: 'get',
path: '/query/trees/951836',
statusCode: 200,
body: {
id:951836,
grower_id: 940
},
});
```

note: Look at `cypress/tests/integration/wallets/[walletid].cy.js` to study more. Once again, ask the team for support, if needed. It is included here for awareness but not necessary for this exercise.

8. Visit the path and confirm the units worked well together (integration)

```
cy.visit(path)
misc cypress code to confirm changes happended
```

9. Use cypress runner to validate the integration test

`npm run cy:nock` - check package.json for specific scripts

Challenge: Use nockIntercept task to add additional API calls needed for the trees/:id route for treetracker

_When done you can delete the file_

---

_Footnote(s)_

[^1]: `**`is a [glob](https://r.search.yahoo.com/_ylt=AwrJ.XfPFr9jE7YNpApXNyoA;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3Nj/RV=2/RE=1673496400/RO=10/RU=https%3a%2f%2fen.wikipedia.org%2fwiki%2fGlob_%28programming%29/RK=2/RS=5mf25_7ZW3baIqm596Rp_g9BmBA-) which match any letters and numbers in a string.
[^2]: [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
[^3]: Fixtures are files with a fixed set of data that we want to use.
[^4]: This patten is within most integration tests in this codebase. If lost, read the other integration tests.
[^5]: Most paths are located in `nockRoutes.js` file, however, if a path is not in the folder and you are lost please ask anyone in the team's slack channel.
