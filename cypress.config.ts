import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'khcsw1',
  e2e: {
    'baseUrl': 'http://localhost:4200',
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
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts'
  }

})
