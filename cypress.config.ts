import { defineConfig } from 'cypress'
import { environment } from './src/environments/environment';

export default defineConfig({
  projectId: 'khcsw1',
  e2e: {
    baseUrl: 'http://localhost:4200',
    env: {
      API_URL: environment.dominion_api_url
    },
    setupNodeEvents(on, config) {
      require("cypress-localstorage-commands/plugin")(on, config);
      return config;
    },
    experimentalSessionAndOrigin: true,
    specPattern: [
      'cypress/e2e/flow/**/*.cy.ts',
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
