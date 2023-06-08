import { sveltekit } from "@sveltejs/kit/vite";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    setupFiles: ["./vitest.setup.ts"],
    exclude: [...configDefaults.exclude, "test"]
  }
});
