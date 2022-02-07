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
  moduleDirectories: ['node_modules', 'src'],
  globalSetup: '<rootDir>/.jest/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/.jest/setupFile.js'],
};
