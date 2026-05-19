import { defineConfig } from "@playwright/test";

export default defineConfig({

  testDir: "./generated-tests",

  timeout: 30000,

  retries: 0,

  use: {

    headless: true,

    screenshot: "on",

    trace: "on",

    video: "on",

    launchOptions: {

      slowMo: 300,

    },

  },

});