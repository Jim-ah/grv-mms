module.exports = {
    testEnvironment: 'node',
    verbose: true,
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    setupFilesAfterEnv: ['./__tests__/setup.js'],
    testPathIgnorePatterns: ['./__tests__/setup.js']
};