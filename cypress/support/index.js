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

// workaround for cypress error: "Your page did not fire its load event within 60000ms."
// issue: https://github.com/cypress-io/cypress/issues/2118
// workaround source: https://github.com/cypress-io/cypress/issues/2938#issuecomment-549565158
Cypress.on('window:before:load', (window) => {
  const original = window.EventTarget.prototype.addEventListener;
  // eslint-disable-next-line no-param-reassign
  window.EventTarget.prototype.addEventListener = (...args) => {
    const hasBeforeunloadArg = args && args[0] === 'beforeunload';
    if (hasBeforeunloadArg) return undefined;
    return original.apply(this, args);
  };
  Object.defineProperty(window, 'onbeforeunload', {
    get() {
      return undefined;
    },
    set() {},
  });
});
