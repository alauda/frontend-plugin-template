const fs = require('node:fs');
const path = require('node:path');

const alauda = require('@alauda/eslint-plugin');
const nxEslintPlugin = require('@nx/eslint-plugin');
const tsEslint = require('typescript-eslint');

const configs = require('./tools/eslintrc/index');

const EDITOR_TSCONFIG = 'tsconfig.editor.json';

const readTsProjectDir = (dir, tsconfigName) =>
  fs
    .readdirSync(dir)
    .filter(subDir => {
      try {
        return fs.statSync(path.resolve(dir, subDir, tsconfigName)).isFile();
      } catch {
        return false;
      }
    })
    .map(subDir => `${dir}/${subDir}`);

const apps = [...readTsProjectDir('apps', EDITOR_TSCONFIG)];

const noRestrictedImportsPaths = [
  {
    name: 'rxjs/operators',
    message: 'Please use top level `rxjs` directly instead.',
  },
  {
    name: 'lodash',
    message: 'Please use `lodash-es` instead.',
  },
  {
    name: 'lodash-es',
    importNames: ['isEqual'],
    message: 'Please use `isEqual` from @alauda-fe/common',
  },
  {
    name: 'monaco-editor',
    message:
      'Please use `monaco-editor/esm/vs/editor/editor.api` to reduce bundle size.',
  },
];

module.exports = tsEslint.config(
  {
    ignores: [
      '/coverage',
      '/dist',
      '/tmp',
      '!/.build',
      '!/.*.js',
      '*.spec.ts',
      '__test__',
      '/assets',
      '**/jest.config.ts',
    ],
  },
  ...configs,
  {
    plugins: {
      '@nx': nxEslintPlugin,
      '@alauda': alauda,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: noRestrictedImportsPaths,
        },
      ],
      '@angular-eslint/template/eqeqeq': 'off',
      '@angular-eslint/template/no-negated-async': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-type-alias': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-ts-expect-error': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/sort-type-union-intersection-members': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'arrow-body-style': 'off',
      'accessor-pairs': 'off',
      'no-magic-numbers': 'off',
      'no-negated-condition': 'off', // not auto-fixable
      'promise/always-return': 'off',
      'promise/catch-or-return': 'off',
      'regexp/optimal-quantifier-concatenation': 1,
      'sonar/no-accessor-field-mismatch': 'off',
      'sonar/no-alphabetical-sort': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-fn-reference-in-iterator': 'off',
      'unicorn/prefer-event-target': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-prototype-methods': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prefer-blob-reading-methods': 'off',
      'no-empty-function': 0,
      '@typescript-eslint/no-empty-function': 2,
      'prettier/prettier': 2,
      '@alauda/params-in-fetcher': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/integration-tests/**/*.ts'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      '@typescript-eslint/ban-tslint-comment': 'error',
      // unsafe
      '@typescript-eslint/prefer-reduce-type-parameter': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unsafe-argument': 'off',
      'no-unsafe-optional-chaining': 'off',
      'regexp/no-dupe-disjunctions': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/prefer-d': 'off',
      'sonarjs/no-small-switch': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },
  {
    files: ['**/i18n.{en,zh}.yaml'],
    rules: {
      'yml/no-empty-document': 'off',
    },
  },
  {
    files: ['Dockerfile'],
    rules: {},
  },
  ...apps.map(dir => {
    const project = path.resolve(dir, EDITOR_TSCONFIG);
    return {
      files: [`${dir}/**/*.ts`],
      languageOptions: {
        parserOptions: {
          project,
        },
      },
      settings: {
        'import/resolver': {
          typescript: {
            project,
          },
        },
      },
      rules: {
        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': 'error',
      },
    };
  }),
);
