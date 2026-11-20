module.exports = {
  extends: [
    'airbnb',
    'next',
    'plugin:react/jsx-runtime',
    'plugin:cypress/recommended',
    'prettier',
  ],

  plugins: ['@eslint-community/eslint-comments', 'sonarjs'],

  rules: {
    // project specific
    camelcase: 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],

    // async functions must use 'await'
    'require-await': 'error',

    // disabled because too strict
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-no-bind': 'off',
    'react/prop-types': ['error', { skipUndeclared: true }],

    // allow test files to use dev dependencies
    'import/no-extraneous-dependencies': [
      'warn',
      {
        devDependencies: [
          '**/*.{test,cy,spec}.js',
          'cypress/**/*',
          '.jest/**/*',
          '**/test-utils.js',
          'src/mocks/*',
          'scripts/**/*',
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

    // should be set to error when warnings are cleared
    'import/prefer-default-export': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/alt-text': 'warn',
    '@next/next/no-img-element': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    'no-nested-ternary': 'warn',
    'prefer-destructuring': 'warn',
    'no-unreachable': 'warn',
    'cypress/unsafe-to-chain-command': 'warn',
    'global-require': 'warn',
    'import/extensions': 'warn',
    'no-dupe-keys': 'warn',

    // Checks for defects: undefined behavior, security issues, anti-patterns
    // and resource leaks. A new rule is a warning, so that it does not stop
    // "next build" or a commit. CI fails on each new finding of a rule (see
    // "npm run baseline"). No rule here has an autofix, because the
    // pre-commit hook runs "eslint --fix".

    // undefined behavior
    'no-constant-binary-expression': 'warn',
    'sonarjs/no-identical-expressions': 'warn',
    'sonarjs/no-all-duplicated-branches': 'warn',
    'sonarjs/no-dead-store': 'warn',

    // security: check each dangerouslySetInnerHTML, also on components, and
    // do not let a blanket eslint-disable hide a rule such as no-eval
    'react/no-danger': ['warn', { customComponentNames: ['*'] }],
    '@eslint-community/eslint-comments/no-unlimited-disable': 'warn',

    // each eslint-disable comment gives a reason after "--"
    '@eslint-community/eslint-comments/require-description': [
      'warn',
      {
        ignore: [
          'eslint',
          'eslint-enable',
          'eslint-env',
          'exported',
          'global',
          'globals',
        ],
      },
    ],

    // anti-patterns
    complexity: ['warn', 20],
    'sonarjs/cognitive-complexity': 'warn',
    'react/no-object-type-as-default-prop': 'warn',

    // resource leaks. The rule replaces the list of airbnb, so the first four
    // entries are airbnb's (eslint-config-airbnb-base/rules/style.js).
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'ForOfStatement',
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
      {
        selector:
          'CallExpression[callee.property.name=/^(off|removeListener|removeEventListener|unsubscribe)$/] > :matches(ArrowFunctionExpression, FunctionExpression)',
        message:
          'A new function here removes nothing. Pass the same function that you added, for example a named handler.',
      },
      {
        selector:
          'CallExpression[callee.name=/^(useEffect|useLayoutEffect)$/] > ArrowFunctionExpression > BlockStatement:not(:has(ReturnStatement)):has(CallExpression[callee.property.name=/^(on|addEventListener|addListener|subscribe|mount|setInterval|setTimeout|observe)$/])',
        message:
          'This effect adds a listener, a timer or an observer, and it has no cleanup. Return a function that removes it.',
      },
    ],
  },

  reportUnusedDisableDirectives: true,

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
