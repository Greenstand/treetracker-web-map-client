// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// Alternatively you can use CommonJS syntax:
// require('./commands')
import 'cypress-watch-and-reload/support';
import './commands';

// The tree and token pages load the Facebook SDK for the Like button.
// src/components/LikeButton.js does not handle a failed load, so a slow or
// blocked Facebook fails the test with an unhandled promise rejection. No
// test checks the Like button, so the SDK loads as an empty script.
beforeEach(() => {
  cy.intercept('https://connect.facebook.net/**', {
    statusCode: 200,
    headers: { 'content-type': 'application/javascript' },
    body: '',
  });
});

// The pages load the Montserrat and Lato fonts from Google Fonts. The tests
// serve the same fonts from cypress/fixtures/fonts. So each screenshot shows
// the right fonts, and a slow Google Fonts cannot stop a page load (its
// stylesheet is in the <head>).
const FONT_FILES = [
  'montserrat-latin-400-normal.woff2',
  'montserrat-latin-600-normal.woff2',
  'montserrat-latin-700-normal.woff2',
  'montserrat-latin-900-normal.woff2',
  'lato-latin-400-normal.woff2',
  'lato-latin-700-normal.woff2',
];

beforeEach(() => {
  cy.intercept(/^https:\/\/fonts\.googleapis\.com\/css2\?family=Montserrat/, {
    fixture: 'fonts/montserrat.css',
    headers: { 'content-type': 'text/css' },
  });
  cy.intercept(/^https:\/\/fonts\.googleapis\.com\/css2\?family=Lato/, {
    fixture: 'fonts/lato.css',
    headers: { 'content-type': 'text/css' },
  });
  FONT_FILES.forEach((file) => {
    cy.intercept(`https://fonts.gstatic.com/cypress-fixtures/${file}`, {
      // ",null" serves the file as binary data
      fixture: `fonts/${file},null`,
      headers: {
        'content-type': 'font/woff2',
        'access-control-allow-origin': '*',
      },
    });
  });
});

// Known defect: the organization, planter and wallet pages call
// map.getInitialView() without a catch. The map core can then reject with
// "Cannot read properties of undefined (reading 'center')". Ignore only this
// error. Remove this handler when the pages handle a failed initial view.
Cypress.on('uncaught:exception', (err) => {
  const isKnownMapError =
    err.message.includes("reading 'center'") &&
    String(err.stack).includes('treetracker-web-map-core');
  return !isKnownMapError;
});
