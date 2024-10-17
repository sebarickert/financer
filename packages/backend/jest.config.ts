import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';

import { compilerOptions } from './tsconfig.path.json';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
};

// Test setup does not work with named exports. Hence, we need to use default export.
// eslint-disable-next-line import/no-default-export
export default config;
