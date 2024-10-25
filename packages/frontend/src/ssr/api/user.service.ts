import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import { Theme, UserDataImportDto, UserDto } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { isValidationErrorResponse } from '$utils/apiHelper';

export class UserService extends BaseApi {
  private static readonly OWN_USER_ID = 'my-user';

  // TODO temporary solution to clear cache while migration
  public static clearCache(): void {
    'use server';
    revalidateTag(this.API_TAG.USER);
  }

  public static async getOwnUserTheme(): Promise<Theme> {
    try {
      const user = await this.getOwnUser();
      return user.theme;
    } catch {
      return Theme.Auto;
    }
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

  public static async DEBUG_overrideOwnUserData(
    user: UserDataImportDto,
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

    return data.payload;
  }
}
