const { defineConfig } = require('cypress');
const setupNext = require('./cypress/plugins');

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 800,
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      return setupNext(on, config);
    },
    specPattern: 'cypress/tests/**/*.cy.js',
    supportFile: 'cypress/support/index.js',
    env: {
      'cypress-watch-and-reload': {
        watch: ['src/**'],
      },
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      return setupNext(on, config);
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.js',
    env: {
      'cypress-watch-and-reload': {
        watch: ['src/**'],
      },
    },
  },
  env: {
    nock: false,
  },
});
