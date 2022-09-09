const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 800,
  nodeVersion: 'system',
  'cypress-watch-and-reload': {
    watch: ['src/**'],
  },
  env: {
    nock: false,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
  },
  component: {
    setupNodeEvents(on, config) {},
    supportFile: 'cypress/support/components-testing.js',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
})
