import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

import {
  SchemaUserDataImportDto,
  SchemaUserDto,
  Theme,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

export class UserService extends BaseApi {
  public static revalidateCache(id?: string): void {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.USER, id));
      return;
    }

    revalidateTag(this.API_TAG.USER);
  }

  private static readonly OWN_USER_ID = 'my-user';

  public static async getOwnUserTheme(): Promise<Theme> {
    try {
      const user = await this.getOwnUser();
      return user.theme;
    } catch {
      return Theme.AUTO;
    }
  }

  public static async getOwnUser(): Promise<SchemaUserDto> {
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

    return data;
  }

  public static async DEBUG_overrideOwnUserData(
    user: SchemaUserDataImportDto,
  ): Promise<string | undefined> {
    const { error, data } = await this.client.POST(
      `/api/users/my-user/my-data`,
      {
        body: user,
      },
    );

    if (error) {
      // TODO ugly hack to handle missing types
      const unknownError = error as unknown;

      if (isValidationErrorResponse(unknownError)) {
        throw new ValidationException(
          'Failed to override user data',
          unknownError.message,
        );
      }

      throw new Error('Failed to override user data', error);
    }

    BaseApi.revalidateFullAppCache();

    return data.payload;
  }

  public static async updateTheme(theme: Theme): Promise<void> {
    await this.client.PATCH('/api/users/my-user', {
      body: {
        theme,
      },
    });

    this.revalidateCache();
  }
}
