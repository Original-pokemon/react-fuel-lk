module.exports = {
  env: { browser: true, es2022: true },
  extends: [
    "eslint:recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:unicorn/recommended",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-refresh",
    "prettier",
    "unicorn",
    "check-file",
    "@emotion",
  ],
  rules: {
    "import/no-unresolved": "error",
    "@emotion/pkg-renaming": "error",
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": "warn",
    "react/jsx-uses-react": "off",
    "react/function-component-definition": "warn",
    "unicorn/no-array-for-each": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
};
