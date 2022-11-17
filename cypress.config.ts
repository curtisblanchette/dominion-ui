import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'khcsw1',
  e2e: {
    baseUrl: 'http://localhost:4200',
    setupNodeEvents(on, config) {
      require("cypress-localstorage-commands/plugin")(on, config);
      return config;
    },
    specPattern: [
      'cypress/e2e/flow/flow.cy.ts'
    ]
  },
  requestTimeout: 180000,
  responseTimeout: 180000,
  retries: {
    runMode: 2,
    openMode: 0
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    specPattern: '**/*.cy.ts'
  }

})
