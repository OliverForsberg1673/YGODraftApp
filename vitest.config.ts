import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "node_modules",
      "dist",
      "tests/e2e/**",
      "tests/**/*.e2e.ts",
      "tests/**/*.spec.ts",
    ],
  },
});
