// @ts-check
import eslint from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import * as importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'node_modules', 'dist', 'build'],
  },
  eslint.configs.all,
  tseslint.configs.eslintRecommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierPlugin,
  importPlugin.flatConfigs?.recommended,
  {
    plugins: {
      'unused-imports': unusedImports,
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
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        // We have `eslint-import-resolver-typescript` that resolves TypeScript path aliases.
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'warn',
      'linebreak-style': 'off',
      'prefer-template': 'error',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          semi: true,
        },
      ],
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
        },
      ],
      // Allow development dependencies in test files.
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*.spec.ts', 'jest.config.ts'],
        },
      ],
      'one-var': ['error', 'never'],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false, // Allow decorators to start with upper case.
          properties: true,
        },
      ],
      // TypeScript compilation already ensures that named imports exist in the referenced module
      'import/named': 'off',
      'sort-keys': 'off',
      'no-ternary': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowBoolean: true,
          allowNumber: true,
        },
      ],
      // Maybe we should enable this in the future for production code.
      'no-undefined': 'off',
    },
  },
  {
    settings: {
      // Some default settings from the import plugin to typescript.
      // 'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      // 'import/parsers': {
      //   '@typescript-eslint/parser': ['.ts', '.tsx'],
      // },
      'import/resolver': {
        typescript: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-lines': 'off',
      'init-declarations': 'off',
      'max-classes-per-file': 'off',
      'class-methods-use-this': 'off',
      'no-magic-numbers': ['error', { ignore: [0] }],
    },
  },
);
