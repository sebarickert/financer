import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const emptyFinancerApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: () => ({}),
});
