import { defineConfig } from "vitest/config";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["html","text"],
      reportsDirectory: "./reports/coverage"
    },
    reporters: [
      "default",
      "junit"
    ],
    outputFile: "./reports/vitest/vitest-report.xml"
  },
  server: {
    port: 3000
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/index.ts",
      exportName: "viteNodeApp",
      tsCompiler: "esbuild",
      swcOptions: {}
    })
  ]
});
