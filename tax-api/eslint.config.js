import js from "@eslint/js";
import globals from "globals";
import ts from "typescript-eslint";

export default ts.config([
  {
    ignores: ["**/dist", "**/reports"],
  },
  { languageOptions: { globals: { ...globals.node, ...globals.vitest } } },
  js.configs.recommended,
  ts.configs.strict,
  ts.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
]);
