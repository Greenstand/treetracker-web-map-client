module.exports = {
  // format all file types recognized by prettier
  '*': ['prettier --ignore-unknown --write'],

  // lint javascript after formatting
  '*.{js,jsx}': ['eslint --fix --cache --quiet'],

  // lint entire project if eslint settings changed
  '.eslint*': ['eslint . --cache'],
};
