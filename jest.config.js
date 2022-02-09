// jest.config.js

module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', //
    '<rootDir>/.next/',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testEnvironment: 'jsdom',
  modulePaths: ['src/'],
  globalSetup: '<rootDir>/.jest/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/.jest/setupFile.js'],
};
