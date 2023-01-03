module.exports = {
  // sort package.json if changed
  'package.json': 'sort-package-json',

  // format all file types recognized by prettier
  '*': ['prettier --ignore-unknown --write'],

  // import alias for uniform pattern of imports
  'src/**/*.js': ['jscodeshift  -t codeshift.js'],

  // lint javascript after formatting
  '*.{js,jsx}': ['eslint --fix --cache'],

  // lint entire project if eslint settings changed, do not pass file name arguments
  '.eslint*': () => 'eslint . --cache',
};
