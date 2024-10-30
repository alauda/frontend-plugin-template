/* eslint-disable sonarjs/no-duplicate-string */
const path = require('node:path');

const babelParse = require('@babel/eslint-parser');
const babel = require('@babel/eslint-plugin');
const {
  isAngularAvailable,
  isPkgAvailable,
  isTsAvailable,
  tryFile,
  tryPkg,
} = require('@pkgr/utils');
const angular = require('angular-eslint');
const angularParse = require('angular-eslint-template-parser');
const jestEslint = require('eslint-plugin-jest');
const jsdoc = require('eslint-plugin-jsdoc');
const eslintPluginJsonc = require('eslint-plugin-jsonc');
const mdx = require('eslint-plugin-mdx');
const yml = require('eslint-plugin-yml');
const tsEslint = require('typescript-eslint');

angularParse.meta = {
  name: 'pipeline-v2',
  version: '0.0.1',
};

const { magicNumbers } = require('./_util');
const { jsoncFiles, nonJsonRcFiles, preferPrettier } = require('./config');

const configFile =
  tryFile(path.resolve('babel.config.js')) ||
  tryFile(path.resolve('.babelrc.js')) ||
  tryPkg('@1stg/babel-preset/config');

const jsBase = {
  files: ['**/*.cjs', '**/*.mjs', '**/*.js', '**/*.jsx'],
  languageOptions: {
    parser: babelParse,
    parserOptions: configFile
      ? {
          babelOptions: {
            configFile,
          },
        }
      : {
          requireConfigFile: false,
        },
  },
  plugins: {
    '@babel': { rules: babel.rules },
  },
  rules: {
    camelcase: [
      2,
      {
        properties: 'never',
        ignoreDestructuring: true,
      },
    ],
    'new-cap': 0,
    'no-invalid-this': 0,
    'no-unused-expressions': 0,
    '@babel/new-cap': 2,
    '@babel/no-invalid-this': 2,
    '@babel/no-unused-expressions': 2,
  },
};

exports.js = tsEslint.config({
  ...jsBase,
  extends: [jsdoc.configs['flat/recommended']],
  rules: {
    ...jsBase.rules,
    'jsdoc/require-jsdoc': 0,
    'jsdoc/require-param-description': 0,
  },
  settings: isTsAvailable
    ? {
        jsdoc: {
          mode: 'typescript',
        },
      }
    : undefined,
});

const project =
  tryFile(path.resolve('tsconfig.eslint.json')) ||
  tryFile(path.resolve('tsconfig.base.json')) ||
  tryFile(path.resolve('tsconfig.json')) ||
  tryPkg('@1stg/tsconfig');

const resolveSettings = {
  'import/external-module-folders': [
    'node_modules',
    'node_modules/@d-ts',
    'node_modules/@types',
  ],
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project,
    },
  },
};

const tsBase = tsEslint.config(...tsEslint.configs.recommended, {
  files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
  settings: resolveSettings,
  languageOptions: {
    parserOptions: {
      project,
    },
  },
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 2,
    '@typescript-eslint/array-type': [
      2,
      {
        default: 'array-simple',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': [
      2,
      {
        types: {
          object: false,
        },
      },
    ],
    '@typescript-eslint/consistent-type-definitions': [2, 'interface'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': [
      2,
      {
        accessibility: 'no-public',
        overrides: {
          parameterProperties: 'off',
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/member-ordering': 2,
    '@typescript-eslint/naming-convention': 0, // TODO: find better config
    '@typescript-eslint/no-empty-function': 2,
    '@typescript-eslint/no-extraneous-class': [
      2,
      {
        allowWithDecorator: true,
      },
    ],
    '@typescript-eslint/no-for-in-array': 2,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/no-require-imports': 2,
    '@typescript-eslint/no-this-alias': [
      2,
      {
        allowDestructuring: true,
        allowedNames: ['self'],
      },
    ],
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'no-useless-constructor': 0,
    '@typescript-eslint/no-useless-constructor': 2,
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/prefer-for-of': 2,
    '@typescript-eslint/prefer-function-type': 2,
    '@typescript-eslint/prefer-optional-chain': 2,
    '@typescript-eslint/prefer-ts-expect-error': 2,
    '@typescript-eslint/sort-type-union-intersection-members': 2,
    '@typescript-eslint/triple-slash-reference': [
      2,
      {
        lib: 'never',
        path: 'always',
        types: 'prefer-import',
      },
    ],
    '@typescript-eslint/unified-signatures': 2,
    camelcase: 0,
    'import/default': 0,
    'import/named': 0,
    'import/namespace': 0,
    'import/no-duplicates': 2,
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'no-empty-function': 0,
    'no-restricted-syntax': [
      2,
      {
        selector:
          'TSTypeAliasDeclaration > .typeAnnotation[type=/^(TS.*Keyword|TSTypeReference)$/]:not(:has(TSTypeParameterInstantiation)):not(:has(TSQualifiedName))',
        message:
          'Type alias references simple `Ts*Keyword`s or `TSTypeReference` only is not allowed',
      },
    ],
    'no-unused-vars': 0,

    'n/shebang': 0,
    // covered by @typescript-eslint/no-floating-promises
    'promise/always-return': 0,
    'promise/catch-or-return': 0,
    // ts itself has guaranteed it
    'unicorn/no-array-callback-reference': 0,
    // covered by @typescript-eslint/no-extraneous-class
    'unicorn/no-static-only-class': 0,
    // covered by @typescript-eslint/no-this-alias
    'unicorn/no-this-assignment': 0,
  },
});

exports.ts = [
  ...tsBase,
  {
    files: ['{bin,cli}.ts'],
    rules: {
      'n/shebang': 0,
    },
  },
  {
    files: ['*.{ts,tsx}'],
    ignores: ['*.d.ts'],
    languageOptions: {
      parserOptions: {
        project,
      },
    },

    rules: {
      '@typescript-eslint/no-floating-promises': [
        2,
        {
          ignoreVoid: true,
        },
      ],
      '@typescript-eslint/no-magic-numbers': [
        2,
        {
          enforceConst: true,
          ignore: magicNumbers,
          ignoreArrayIndexes: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 2,
      '@typescript-eslint/no-unnecessary-qualifier': 2,
      '@typescript-eslint/no-unnecessary-type-arguments': 2,
      '@typescript-eslint/prefer-readonly': 2,
      '@typescript-eslint/prefer-reduce-type-parameter': 2,
      '@typescript-eslint/prefer-string-starts-ends-with': 2,
      '@typescript-eslint/require-array-sort-compare': [
        2,
        {
          ignoreStringArrays: true,
        },
      ],
      '@typescript-eslint/restrict-plus-operands': 2,
      'no-constant-condition': 0,
      'no-magic-numbers': 0,
    },
  },
];

exports.dTs = {
  files: ['*.d.cts', '*.d.mts', '*.d.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-extraneous-class': 0,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'import/no-duplicates': 0,
    'import/order': 0,
  },
};

exports.angular = tsEslint.config(
  {
    files: ['**/*.ts'],
    ignores: ['*.d.ts'],
    languageOptions: {
      parserOptions: {
        project,
      },
    },
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 2,
    },
  },

  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    languageOptions: {
      parser: angularParse,
      parserOptions: {
        project,
      },
    },
    rules: {
      '@angular-eslint/template/eqeqeq': [
        2,
        {
          allowNullOrUndefined: true,
        },
      ],
      'prettier/prettier': [
        preferPrettier ? 0 : 2,
        {
          parser: 'angular',
        },
      ],
      'spaced-comment': 0,
    },
  },
  {
    files: ['**/*inline-template-*.component.html'],
    extends: [...angular.configs.templateRecommended],
    languageOptions: {
      parser: angularParse,
      parserOptions: {
        project,
      },
    },
    rules: {
      'unicorn/no-empty-file': 0,
    },
  },
);

exports.md = [
  {
    ...mdx.flat,
    rules: {
      ...mdx.flat.rules,
      'prettier/prettier': preferPrettier ? 0 : 2,
    },
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
      // if you want to override some rules for code blocks
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
];

const nonSourceRules = {
  'n/no-extraneous-import': 0,
  'n/no-extraneous-require': 0,
  'n/no-unsupported-features/es-builtins': 0,
};

exports.test = {
  files: ['**/{__test__,test,tests}/**/*'],
  rules: nonSourceRules,
};

exports.jest = {
  ...jestEslint.configs['flat/recommended'],
  files: ['**/*.{spec,test}.{js,jsx,ts,tsx}'],
  rules: {
    ...jestEslint.configs['flat/recommended'].rules,
    ...exports.test.rules,
  },
};

exports.script = exports.scripts = {
  files: ['**/scripts/**/*'],
  rules: nonSourceRules,
};

exports.story = exports.stories = {
  files: ['**/.storybook/**/*', '**/stories/**/*'],
  rules: nonSourceRules,
};

exports.config = exports.configs = {
  files: ['**/.*.js', '**/*.config.{js,ts}'],
  rules: nonSourceRules,
};

exports.json = tsEslint.config({
  files: ['**/.*rc', '**/*.json'],
  ignores: [...nonJsonRcFiles, ...jsoncFiles],
  extends: [
    ...eslintPluginJsonc.configs['flat/recommended-with-json'],
    ...eslintPluginJsonc.configs['flat/prettier'],
  ],
});

exports.jsonc = tsEslint.config({
  files: jsoncFiles,
  extends: [
    ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
    ...eslintPluginJsonc.configs['flat/prettier'],
  ],
});

exports.json5 = tsEslint.config({
  files: ['**/*.json5'],
  extends: [
    ...eslintPluginJsonc.configs['flat/recommended-with-json5'],
    ...eslintPluginJsonc.configs['flat/prettier'],
  ],
});

exports.yml = exports.yaml = tsEslint.config({
  files: ['**/*.yml', '**/*.yaml'],
  extends: [
    ...yml.configs['flat/recommended'],
    ...yml.configs['flat/prettier'],
  ],
});

exports.overrides = []
  .concat(
    ...(isPkgAvailable('@babel/core') && exports.js),
    ...(isTsAvailable && exports.ts),
    ...(isAngularAvailable && exports.angular),
    ...exports.md,
    isPkgAvailable('jest') && exports.jest,
    exports.test,
    exports.scripts,
    exports.stories,
    exports.configs,
    exports.dTs,
    exports.json,
    exports.jsonc,
    exports.json5,
    exports.yaml,
  )
  .filter(Boolean);
