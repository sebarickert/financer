// @ts-check
import { dirname } from "path";
import { fileURLToPath } from "url";

import eslint from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import { fixupPluginRules } from "@eslint/compat";

import { FlatCompat } from "@eslint/eslintrc";

const filename = fileURLToPath(import.meta.url);
const currentDirname = dirname(filename);

const compat = new FlatCompat({
  baseDirectory: currentDirname,
});

const pluginsToPatch = ["next/core-web-vitals", "next/typescript"];

const compatConfig = [...compat.extends("next/core-web-vitals")];

const patchedConfig = compatConfig.map((entry) => {
  const plugins = entry.plugins;
  for (const key in plugins) {
    if (plugins.hasOwnProperty(key) && pluginsToPatch.includes(key)) {
      plugins[key] = fixupPluginRules(plugins[key]);
    }
  }
  return entry;
});

export default tseslint.config(
  ...patchedConfig,
  {
    ignores: ["eslint.config.mjs", "node_modules", "dist", "build"],
  },
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierPlugin,
  // Next stuff already includes import plugin
  // importPlugin.flatConfigs?.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
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
      // TS seems to infer types incorrectly from our API client so we need to disable this rule.
      // We should revisit this in the future.
      "@typescript-eslint/no-unnecessary-condition": "off",
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
    files: ["app/**/*.tsx"],
    rules: {
      "import/prefer-default-export": "error",
      "import/no-default-export": "off",
    },
  }
);
