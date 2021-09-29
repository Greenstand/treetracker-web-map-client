module.exports = (on, config) => {
        // `on` is used to hook into various events Cypress emits
        // `config` is the resolved Cypress config
        // copy from https://github.com/cypress-io/cypress/tree/master/npm/react
        require('@cypress/react/plugins/react-scripts')(on, config)
        // IMPORTANT to return the config object
        // with the any changed environment variables

        return config
}