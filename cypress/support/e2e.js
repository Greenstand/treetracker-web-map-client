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

// The map loads its background tiles from the map service of Google. The
// tests serve one plain test tile for each of them. So a slow or blocked
// Google cannot leave the map grey in a screenshot, and the wait for the map
// in cy.screenshotPage() does not depend on Google. The tree tiles come from
// the dev server, as before.
beforeEach(() => {
  cy.intercept(/^https:\/\/mt\d\.google\.com\/vt\//, {
    // ",null" serves the file as binary data
    fixture: 'tiles/background.png,null',
    headers: {
      'content-type': 'image/png',
      'access-control-allow-origin': '*',
    },
  });
});

// When the map has no tree in its view, the map core asks the API for the
// nearest tree. This request can fail with status 422 (a known defect of the
// map core), and the failure stops the test with an unhandled promise
// rejection. The tests answer "no nearest tree".
beforeEach(() => {
  cy.intercept(/\/query\/gis\/location\/nearest\?/, {
    body: { nearest: null },
    headers: { 'access-control-allow-origin': '*' },
  });
});
