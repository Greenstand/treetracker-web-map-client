/* eslint-disable global-require */

// start the Next.js server when Cypress starts
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (_on, config) => {
  require('cypress-watch-and-reload/plugins')(config);

  return config;
};
