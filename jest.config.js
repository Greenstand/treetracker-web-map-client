// jest.config.js

module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', //
    '<rootDir>/.next/',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  modulePaths: ['src/'],
  testEnvironment: 'jsdom',
  globalSetup: '<rootDir>/.jest/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/.jest/setupFile.js'],
};
