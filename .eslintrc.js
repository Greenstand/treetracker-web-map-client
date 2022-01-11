module.exports = {
  extends: [
    'airbnb',
    'next',
    'plugin:react/jsx-runtime',
    'plugin:cypress/recommended',
    'prettier',
  ],

  rules: {
    // project specific
    camelcase: 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
    'react/prop-types': ['error', { skipUndeclared: true }],
    'react/jsx-props-no-spreading': 'off',

    // async functions must use 'await'
    'require-await': 'error',

    // allow test files to use dev dependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.{test,cy,spec}.js',
          'cypress/**/*',
          '.jest/**/*',
          '**/test-utils.js',
        ],
      },
    ],

    // import sorting
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // node built in
          'external', // installed dependencies
          'internal', // baseUrl
          'index', // ./
          'sibling', // ./*
          'parent', // ../*
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        'newlines-between': 'never',
      },
    ],

    // rule triggers false positive
    '@next/next/no-page-custom-font': 'off',

    // should be set to error when problems are cleared
    'import/prefer-default-export': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/alt-text': 'warn',
    '@next/next/no-img-element': 'warn',
    'react/jsx-no-bind': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },

  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },

  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
};
