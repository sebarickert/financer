// @ts-check
import eslint from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import * as importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs", "node_modules", "dist", "build"],
  },
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierPlugin,
  importPlugin.flatConfigs?.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
      // import: importPlugin,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
      ecmaVersion: 5,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        // We have `eslint-import-resolver-typescript` that resolves TypeScript path aliases.
      },
    },
  },
  {
    rules: {
      "unused-imports/no-unused-imports": "error",
      "linebreak-style": "off",
      "prefer-template": "error",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: true,
          semi: true,
        },
      ],
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
        },
      ],
      // Allow development dependencies in test files.
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.spec.ts",
            "jest.config.ts",
            "test/**/*.ts",
            "./src/setup-tests.tsx",
          ],
        },
      ],
      "one-var": ["error", "never"],
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowBoolean: true,
          allowNumber: true,
        },
      ],
    },
  },
  {
    settings: {
      "import/resolver": {
        typescript: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  }
);
