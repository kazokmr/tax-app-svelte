import js from "@eslint/js";
import globals from "globals";
import ts from "typescript-eslint";

export default [
  {
    ignores: ["**/dist", "**/reports"],
  },
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...ts.configs.recommended,
];
