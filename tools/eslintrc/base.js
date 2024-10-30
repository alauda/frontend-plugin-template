/* eslint-disable sonarjs/no-duplicate-string */
const { fixupPluginRules } = require('@eslint/compat');
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const standard = require('eslint-config-standard');
const css = require('eslint-plugin-css');
const pluginESx = require('eslint-plugin-es-x');
const { getGlobals } = require('eslint-plugin-mdx');
const n = require('eslint-plugin-n');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const promise = require('eslint-plugin-promise');
const regexp = require('eslint-plugin-regexp');
const eslintPluginImportSort = require('eslint-plugin-simple-import-sort');
const sonarjsEslint = require('eslint-plugin-sonarjs');
const eslintPluginUnicorn = require('eslint-plugin-unicorn');

const compat = new FlatCompat();

/**
 * @param {string} name the pugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
function legacyPlugin(name, alias = name) {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  // @ts-expect-error plugin is a legacy fix
  return fixupPluginRules(plugin);
}

const {
  isWebpackAvailable,
  magicNumbers,
  webpackSpecVars,
} = require('./_util');

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const configs = [
  js.configs.recommended,
  promise.configs['flat/recommended'],
  css.configs['flat/recommended'],
  n.configs['flat/recommended'],
  sonarjsEslint.configs.recommended,
  ...compat.extends('plugin:import/typescript'),
  {
    plugins: {
      'es-x': pluginESx,
      unicorn: eslintPluginUnicorn,
      'simple-import-sort': eslintPluginImportSort,
      regexp,
      import: legacyPlugin('eslint-plugin-import', 'import'),
    },
    languageOptions: {
      globals: isWebpackAvailable ? getGlobals(webpackSpecVars) : undefined,
    },
    rules: {
      ...standard.rules,
      'arrow-body-style': 2,
      camelcase: [
        2,
        {
          properties: 'never',
          ignoreDestructuring: true,
          allow: isWebpackAvailable ? webpackSpecVars : undefined,
        },
      ],
      'import/first': 2,
      'import/no-duplicates': 2,
      'import/order': [
        2,
        {
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'no-else-return': [
        2,
        {
          allowElseIf: false,
        },
      ],
      'no-empty': [
        2,
        {
          allowEmptyCatch: true,
        },
      ],
      'no-empty-function': 2,
      'no-labels': 0,
      'no-magic-numbers': [
        2,
        {
          enforceConst: true,
          ignore: magicNumbers,
          ignoreArrayIndexes: true,
        },
      ],
      'no-negated-condition': 2,
      'no-process-exit': 0, // suspended by unicorn/no-process-exit

      // The following rules are duplicate with `eslint-plugin-import`
      'n/no-extraneous-import': 0,
      'n/no-extraneous-require': 0,
      'n/no-missing-import': 0,
      'n/no-missing-require': 0,

      'n/no-unsupported-features/es-syntax': 0,
      'n/no-unsupported-features/node-builtins': 0,
      'n/no-unpublished-import': 0,
      'n/no-unpublished-require': 0,
      'prefer-const': [
        2,
        {
          destructuring: 'all',
        },
      ],
      'prefer-object-spread': 2,
      'simple-import-sort/exports': 2,
      'unicorn/catch-error-name': [
        2,
        {
          name: 'error',
          ignore: ['^e(rr)?$'],
        },
      ],
      'unicorn/consistent-function-scoping': 0,
      'unicorn/filename-case': [
        2,
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
          // ignore UPPER_CASE markdown filenames
          ignore: [/^[A-Z](([\dA-Z]+_)*[\dA-Z]+)?\.mdx?$/],
        },
      ],
      'unicorn/no-array-reduce': 0,
      'unicorn/no-null': 0,
      'unicorn/no-unreadable-array-destructuring': 0, // conflict with `no-unused-vars`
      'unicorn/prefer-module': 0,
      'unicorn/prefer-object-from-entries': 0,
      'unicorn/prevent-abbreviations': 0,
    },
  },
  eslintPluginPrettierRecommended,
];

module.exports = configs;
