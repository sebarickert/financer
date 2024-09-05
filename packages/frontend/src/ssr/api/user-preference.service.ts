import { BaseApi } from './base-api';

import {
  AccountType,
  UserPreferenceProperty,
} from '$api/generated/financerApi';

type UserDashboardSettings = {
  accountTypes: AccountType[];
};

export class UserPreferenceService extends BaseApi {
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
      },
    );

    return data?.value
      ? (JSON.parse(data.value) as UserDashboardSettings)
      : undefined;
  }
}
