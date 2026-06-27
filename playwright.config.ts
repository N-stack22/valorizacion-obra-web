import { defineConfig, devices } from "@playwright/test";

const localBrowserChannel = process.env.CI ? undefined : "chrome";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(localBrowserChannel ? { channel: localBrowserChannel } : {}),
      },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "node ./node_modules/vite/bin/vite.js dev --host 127.0.0.1 --port 3000",
        url: "http://localhost:3000",
        env: {
          ...process.env,
          npm_lifecycle_event: "test:blackbox",
        },
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
