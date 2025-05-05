import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

export default ts.config([
  {
    ignores: ["**/build", "**/.svelte-kit", "**/package", "**/storybook-static"],
  },
  js.configs.recommended,
  ts.configs.strict,
  ts.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  svelte.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.vitest } } },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
]);
