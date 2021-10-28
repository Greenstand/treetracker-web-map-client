module.exports = {
  '*.{js,jsx,ts,tsx,html,css}': ['prettier --write', 'eslint --fix'],
  '*.{md,json,yml,yaml}': ['prettier --write'],
};
