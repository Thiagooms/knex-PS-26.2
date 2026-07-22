import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.integration.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
    fileParallelism: false,
    testTimeout: 30000,
  },
});
