import { defineConfig, devices } from "@playwright/test";

const localBrowserChannel = process.env.CI ? undefined : "chrome";

const e2eSupabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
const e2eSupabaseKey =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.e2e-test-anon-key";

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
          VITE_SUPABASE_URL: e2eSupabaseUrl,
          VITE_SUPABASE_PUBLISHABLE_KEY: e2eSupabaseKey,
          SUPABASE_URL: e2eSupabaseUrl,
          SUPABASE_PUBLISHABLE_KEY: e2eSupabaseKey,
        },
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
