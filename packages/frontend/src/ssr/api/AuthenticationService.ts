import { BaseApi } from './BaseApi';

import { SchemaAuthenticationStatusDto } from '@/api/ssr-financer-api';

export class AuthenticationService extends BaseApi {
  public static async getStatus(): Promise<SchemaAuthenticationStatusDto | null> {
    const { data } = await this.client.GET('/auth/status', {
      next: {
        tags: [this.API_TAG.AUTHENTICATION],
      },
    });

    return data ?? null;
  }
}
