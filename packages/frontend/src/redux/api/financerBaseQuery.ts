import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { getSessionId } from '$ssr/get-session-id';
import { isServerSide } from '$utils/is-server-side';

const URL_PARAM_ARRAY_SEPARATOR = '|';

const getInternalApiRootAddressOnServer = async (): Promise<string> => {
  if (!isServerSide()) return '';

  const { getInternalApiRootAddress } = await import('$utils/address.helper');
  return getInternalApiRootAddress();
};

export const financerBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: unknown = {},
) => {
  const url = await getInternalApiRootAddressOnServer();

  return fetchBaseQuery({
    baseUrl: `${url}/`,
    cache: isServerSide() ? 'no-store' : undefined,
    prepareHeaders: async (headers) => {
      if (isServerSide()) {
        const sessionId = await getSessionId();
        headers.set('Cookie', `connect.sid=${sessionId}`);
      }
    },
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
