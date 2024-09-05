import createClient from 'openapi-fetch';

import { paths } from '$api/generated/ssr-financer-api';
import { getSessionId } from '$ssr/get-session-id';
import { getInternalApiRootAddress } from '$utils/address.helper';

export abstract class BaseApi {
  private static async getNextOptions(
    requestOptions: NextFetchRequestConfig | undefined,
  ): Promise<NextFetchRequestConfig> {
    const baseOptions = {
      revalidate: 5,
      tags: [(await getSessionId()) ?? ''],
    };

    if (!requestOptions) {
      return baseOptions;
    }

    return {
      revalidate: requestOptions.revalidate ?? baseOptions.revalidate,
      tags: baseOptions.tags?.concat(requestOptions.tags ?? []),
    };
  }

  protected static readonly client = createClient<paths>({
    baseUrl: getInternalApiRootAddress(),
    fetch: async (request) => {
      const next = await this.getNextOptions((request as RequestInit).next);

      const headers = new Headers(request.headers);
      headers.set('Cookie', `connect.sid=${await getSessionId()}`);

      return fetch(request.url, { ...request, headers, next });
    },
    querySerializer: {
      array: {
        explode: false,
        style: 'pipeDelimited',
      },
    },
  });
}
