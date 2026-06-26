/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Expose Node's global.gc so memory-leak tests can force collection
    // and obtain reliable heap measurements in CI.
    pool: "forks",
    execArgv: ["--expose-gc"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      reporter: ["text", "text-summary", "json", "html", "lcov"],
      include: ["src/lib/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/routeTree.gen.ts",
        "src/integrations/supabase/types.ts",
        "src/components/**",
        "src/routes/**",
        "src/hooks/**",
        "src/**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
