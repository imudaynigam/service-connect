import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Apply configurations for TypeScript files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser, // Use TypeScript parser
      ecmaVersion: "latest", // Enable latest JavaScript features
      sourceType: "module", // Set the module system to ES Modules
      globals: globals.browser, // Use browser globals
    },
    plugins: {
      "@typescript-eslint": tseslint, // Register the TypeScript ESLint plugin
    },
    rules: {
      // Extend the TypeScript recommended rules
      ...tseslint.configs.recommended.rules,

      // Custom ESLint rules
      "no-unused-vars": "warn",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
  // Apply ESLint's recommended rules for JavaScript files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs", // For CommonJS
      globals: globals.node, // Use Node.js globals
    },
    ...js.configs.recommended, // Use ESLint's recommended rules
  },
];
