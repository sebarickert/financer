import { defineConfig } from 'cypress';

export default defineConfig({
  experimentalStudio: true,
  chromeWebSecurity: false,
  projectId: 'm8tf11',
  viewportWidth: 1024,
  e2e: {
    baseUrl: 'http://localhost:3000',
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
