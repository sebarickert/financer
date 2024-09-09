import { revalidateTag } from 'next/cache';

import { BaseApi } from './base-api';

import {
  AccountType,
  UserPreferenceProperty,
} from '$api/generated/financerApi';

type UserDashboardSettings = {
  accountTypes: AccountType[];
};

type UserStatisticsSettings = {
  accountTypes: AccountType[];
};

export class UserPreferenceService extends BaseApi {
  // TODO temporary solution to clear cache while migration
  public static clearCache(): void {
    'use server';
    revalidateTag(this.API_TAG.USER_PREFERENCE);
  }

  public static async getDashboardSettings(): Promise<
    UserDashboardSettings | undefined
  > {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty: UserPreferenceProperty.DashboardSettings,
          },
        },
        next: {
          tags: [
            this.API_TAG.USER_PREFERENCE,
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DashboardSettings,
            ),
          ],
        },
      },
    );

    return data?.value
      ? (JSON.parse(data.value) as UserDashboardSettings)
      : undefined;
  }

  public static async getStatisticsSettings(): Promise<
    UserStatisticsSettings | undefined
  > {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty: UserPreferenceProperty.StatisticsSettings,
          },
        },
        next: {
          tags: [
            this.API_TAG.USER_PREFERENCE,
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.StatisticsSettings,
            ),
          ],
        },
      },
    );

    return data?.value
      ? (JSON.parse(data.value) as UserStatisticsSettings)
      : undefined;
  }
}
