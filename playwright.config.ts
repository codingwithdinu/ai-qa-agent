import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./generated-tests",

  timeout: 30000,

  use: {
    headless: true,
  },
});