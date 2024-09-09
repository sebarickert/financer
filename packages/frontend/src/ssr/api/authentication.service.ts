import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import { AuthenticationStatusDto } from '$api/generated/financerApi';

export class AuthenticationService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static clearCache(): void {
    'use server';
    revalidateTag(this.API_TAG.AUTHENTICATION);
  }

  public static async getStatus(): Promise<
    AuthenticationStatusDto | undefined
  > {
    const { data } = await this.client.GET('/auth/status', {
      next: {
        tags: [this.API_TAG.AUTHENTICATION],
      },
    });

    return data as AuthenticationStatusDto;
  }
}
