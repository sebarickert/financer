'use server';
import { client } from './ApiClient';
import { API_TAG } from './ApiTags';

import { SchemaAuthenticationStatusDto } from '@/api/ssr-financer-api';

export const getAuthenticationStatus =
  async (): Promise<SchemaAuthenticationStatusDto | null> => {
    const { data } = await client.GET('/auth/status', {
      next: {
        tags: [API_TAG.AUTHENTICATION],
      },
    });

    return data ?? null;
  };
