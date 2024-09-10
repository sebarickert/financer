import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import { UserDto } from '$api/generated/financerApi';

export class UserService extends BaseApi {
  private static readonly OWN_USER_ID = 'my-user';

  // TODO temporary solution to clear cache while migration
  public static clearCache(): void {
    'use server';
    revalidateTag(this.API_TAG.USER);
  }

  public static async getOwnUser(): Promise<UserDto> {
    const { data, error } = await this.client.GET(`/api/users/my-user`, {
      next: {
        tags: [
          this.API_TAG.USER,
          this.getEntityTag(this.API_TAG.USER, this.OWN_USER_ID),
        ],
      },
    });

    if (error) {
      throw new Error('Failed to fetch own user data', error);
    }

    return data as UserDto;
  }
}
