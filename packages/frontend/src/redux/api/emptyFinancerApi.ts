import { createApi } from '@reduxjs/toolkit/query/react';

import { financerBaseQuery } from './financerBaseQuery';

export const emptyFinancerApi = createApi({
  baseQuery: financerBaseQuery,
  endpoints: () => ({}),
});
