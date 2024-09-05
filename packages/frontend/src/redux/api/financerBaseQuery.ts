import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

const URL_PARAM_ARRAY_SEPARATOR = '|';

export const financerBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: unknown = {},
) => {
  return fetchBaseQuery({
    baseUrl: `/`,
    paramsSerializer: (params) => {
      const formattedParams = Object.fromEntries(
        Object.entries(params)
          .filter(([, value]) => !!value)
          .map(([key, value]) => [
            key,
            Array.isArray(value)
              ? value.join(URL_PARAM_ARRAY_SEPARATOR)
              : value,
          ]),
      );

      return new URLSearchParams(formattedParams).toString();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })(args, api, extraOptions as any);
};
