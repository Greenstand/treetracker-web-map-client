// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Wait until the map shows. Without this wait, a screenshot can show a grey
// box in place of the map.
// - The map must exist (its attribution line), or the test fails.
// - Then the wait gives the tiles up to 15 s to load and to end their fade-in
//   (a tile that fails counts as done). cypress/support/e2e.js serves the
//   background tiles, so they come at once; the tree tiles come from the dev
//   server. After 15 s the screenshot comes also when some tiles are not
//   drawn, so a slow dev server cannot fail the test.
const opacityOf = (tile) =>
  Number(tile.ownerDocument.defaultView.getComputedStyle(tile).opacity);

const waitForMap = () => {
  cy.get('.leaflet-control-attribution', { timeout: 30000 });
  cy.window({ log: false }).then(
    { timeout: 20000 },
    (win) =>
      new Cypress.Promise((resolve) => {
        const end = Date.now() + 15000;
        const check = () => {
          const tiles = [...win.document.querySelectorAll('img.leaflet-tile')];
          const done =
            tiles.length > 0 &&
            tiles.every((tile) => tile.complete && opacityOf(tile) === 1);
          if (done || Date.now() > end) resolve();
          else setTimeout(check, 250);
        };
        check();
      }),
  );
};

// Take a screenshot of the page when its web fonts are loaded and its map
// shows. Without the font wait, a screenshot can show the fallback font of
// the browser. Each page with a screenshot has the map.
Cypress.Commands.add('screenshotPage', () => {
  cy.document().its('fonts.status').should('equal', 'loaded');
  waitForMap();
  cy.screenshot();
});
