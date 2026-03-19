const { FlatCompat } = await import("@eslint/eslintrc");
const eslint = await import("eslint");

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...compat.env({
    browser: true,
    es2024: true,
    node: true,
  }),
  ...compat.config({
    extends: ["plugin:@typescript-eslint/recommended", "plugin:react/recommended"],
    plugins: ["@typescript-eslint", "react"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
    },
  },
];
