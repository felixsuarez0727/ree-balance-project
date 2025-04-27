export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    testMatch: ['**/tests/**/*.test.tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],

  };
  