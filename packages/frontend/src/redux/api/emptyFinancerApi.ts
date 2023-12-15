import { createApi } from '@reduxjs/toolkit/query/react';

import { financerBaseQuery } from './financerBaseQuery';
import { financerApi } from './generated/financerApi';

export type EndpointName = keyof typeof financerApi.endpoints;

export const emptyFinancerApi = createApi({
  baseQuery: financerBaseQuery,
  endpoints: () => ({}),
});
