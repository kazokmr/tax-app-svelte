module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:svelte/recommended", "prettier", "plugin:storybook/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"]
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  overrides: [{
    file: ["*.svelte"],
    parser: "svelte-eslint-parser",
    parserOptions: {
      parser: "@typescript-eslint/parser"
    }
  }]
};