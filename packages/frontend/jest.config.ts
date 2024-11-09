import nextJest from 'next/jest';
import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.path.json';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig: JestConfigWithTsJest = {
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  resetMocks: false,
  moduleDirectories: ['<rootDir>', 'node_modules'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  prettierPath: null,
  testMatch: ['<rootDir>/src/**//**/*.{test,spec}.{js,jsx,ts,tsx}'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// eslint-disable-next-line import/no-default-export
export default createJestConfig(customJestConfig as any);