import { createApi } from '@reduxjs/toolkit/query/react';

import { financerBaseQuery } from './financerBaseQuery';
import { financerApi } from './generated/financerApi';

export type FinancerApiEndpointName = keyof typeof financerApi.endpoints;

export type EndpointName = FinancerApiEndpointName; // NOSONAR

export const emptyFinancerApi = createApi({
  baseQuery: financerBaseQuery,
  endpoints: () => ({}),
});
