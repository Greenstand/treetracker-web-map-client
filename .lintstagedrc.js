module.exports = {
  // sort package.json if changed
  'package.json': 'sort-package-json',

  // import alias for uniform pattern of imports
  'src/**/*.js': ['jscodeshift  -t scripts/codeshift.js'],

  // format all file types recognized by prettier
  '*': ['prettier --ignore-unknown --write'],

  // lint javascript after formatting
  '*.{js,jsx}': ['eslint --fix --cache'],

  // lint entire project if eslint settings changed, do not pass file name arguments
  '.eslint*': () => 'eslint . --cache',
};
