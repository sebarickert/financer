/* eslint-disable import/no-extraneous-dependencies */
import { test as setup } from '@playwright/test';

import { parsePort } from './setup';

const parseBaseUrl = (testIndex: number) =>
  `http://localhost:${parsePort(testIndex)}`;

export const getBaseUrl = () => {
  const workerIndex = parseInt(process.env.TEST_PARALLEL_INDEX ?? '');
  return parseBaseUrl(workerIndex);
};

export const test = setup.extend({
  baseURL: async ({}, use) => {
    const workerIndex = parseInt(process.env.TEST_PARALLEL_INDEX ?? '');
    await use(parseBaseUrl(workerIndex));
  },
});

export { expect, type Page } from '@playwright/test';
