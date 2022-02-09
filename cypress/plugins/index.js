/* eslint-disable global-require */
const injectDevServer = require('@cypress/react/plugins/next');

// start the Next.js server when Cypress starts
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  require('cypress-watch-and-reload/plugins')(config);
  injectDevServer(on, config);

  return config;
};
