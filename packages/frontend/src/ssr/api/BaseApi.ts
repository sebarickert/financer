import { revalidateTag } from 'next/cache';
import createClient from 'openapi-fetch';

import { paths } from '@/api/ssr-financer-api';
import { getSessionId } from '@/ssr/getSessionId';
import { getInternalApiRootAddress } from '@/utils/address.helper';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class BaseApi {
  public static readonly API_TAG = {
    APP: 'app',
    ACCOUNT: 'account',
    AUTHENTICATION: 'authentication',
    USER: 'user',
    USER_PREFERENCE: 'user-preference',
    TRANSACTION_TEMPLATE: 'transaction-template',
    TRANSACTION: 'transaction',
    INCOME: 'income',
    EXPENSE: 'expense',
    TRANSFER: 'transfer',
    CATEGORY: 'category',
  } as const;

  public static revalidateFullAppCache(): void {
    revalidateTag(this.API_TAG.APP);
  }

  protected static getEntityTag(
    tag: (typeof BaseApi.API_TAG)[keyof typeof BaseApi.API_TAG],
    id: string,
  ): string {
    return `${tag}:id:${id}`;
  }

  private static async getNextOptions(
    requestOptions: NextFetchRequestConfig | undefined,
    method: string,
  ): Promise<NextFetchRequestConfig> {
    const baseOptions = {
      revalidate: method === 'GET' ? 900 : undefined, // 15 minutes for GET requests
      tags: [(await getSessionId()) ?? '', this.API_TAG.APP],
    };

    if (!requestOptions) {
      return baseOptions;
    }

    return {
      revalidate: requestOptions.revalidate ?? baseOptions.revalidate,
      tags: baseOptions.tags.concat(requestOptions.tags ?? []),
    };
  }

  protected static readonly client = createClient<paths>({
    baseUrl: getInternalApiRootAddress(),
    fetch: async (request) => {
      const next = await this.getNextOptions(
        (request as RequestInit).next,
        request.method,
      );

      const headers = new Headers(request.headers);
      headers.set('Cookie', `connect.sid=${await getSessionId()}`);

      const body = await request.text();

      return fetch(request.url, {
        body:
          ['POST', 'PUT', 'PATCH', 'OPTIONS'].includes(request.method) && body
            ? body
            : undefined,
        // We are using revalidateTag in the API, so next will throw warnings if we have a cache default and revalidate set
        cache: request.cache === 'default' ? undefined : request.cache,
        credentials: request.credentials,
        headers,
        integrity: request.integrity,
        method: request.method,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        keepalive: request.keepalive,
        signal: request.signal,
        next,
      });
    },
    querySerializer: {
      array: {
        explode: false,
        style: 'pipeDelimited',
      },
    },
  });
}
