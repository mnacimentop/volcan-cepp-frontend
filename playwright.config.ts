import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  timeout: 30000,

  expect: {
    timeout: 5000,
  },

  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html"]],

  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    actionTimeout: 10000,
    navigationTimeout: 15000,

    testIdAttribute: "data-testid",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: CI ? "pnpm build && pnpm start" : "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !CI,
    timeout: 120000,
  },
});
