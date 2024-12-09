import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

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

export type UserDefaultMarketUpdateSettings = {
  transactionDescription: string;
  category?: string;
};

export class UserPreferenceService extends BaseApi {
  public static async revalidateCache(
    id?: UserPreferenceProperty,
  ): Promise<void> {
    if (id) {
      revalidateTag(this.getEntityTag(this.API_TAG.USER_PREFERENCE, id));
      return;
    }

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

  public static async updateDashboardSettings(
    newValue: UserDashboardSettings,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.DashboardSettings,
        value: JSON.stringify(newValue),
      },
    });

    await this.revalidateCache(UserPreferenceProperty.DashboardSettings);
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

  public static async updateStatisticsSettings(
    newValue: UserStatisticsSettings,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.StatisticsSettings,
        value: JSON.stringify(newValue),
      },
    });

    await this.revalidateCache(UserPreferenceProperty.StatisticsSettings);
  }

  public static async getDefaultExpenseAccount(): Promise<string | undefined> {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.DefaultExpenseAccount,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DefaultExpenseAccount,
            ),
          ],
        },
      },
    );

    return data?.value;
  }

  public static async updateDefaultExpenseAccount(
    newValue: string,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.DefaultExpenseAccount,
        value: newValue,
      },
    });

    await this.revalidateCache(UserPreferenceProperty.DefaultExpenseAccount);
  }

  public static async getDefaultIncomeAccount(): Promise<string | undefined> {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty: UserPreferenceProperty.DefaultIncomeAccount,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DefaultIncomeAccount,
            ),
          ],
        },
      },
    );

    return data?.value;
  }

  public static async updateDefaultIncomeAccount(
    newValue: string,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.DefaultIncomeAccount,
        value: newValue,
      },
    });

    await this.revalidateCache(UserPreferenceProperty.DefaultIncomeAccount);
  }

  public static async getDefaultTransferTargetAccount(): Promise<
    string | undefined
  > {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.DefaultTransferTargetAccount,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DefaultTransferTargetAccount,
            ),
          ],
        },
      },
    );

    return data?.value;
  }

  public static async updateDefaultTransferTargetAccount(
    newValue: string,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.DefaultTransferTargetAccount,
        value: newValue,
      },
    });

    await this.revalidateCache(
      UserPreferenceProperty.DefaultTransferTargetAccount,
    );
  }

  public static async getDefaultTransferSourceAccount(): Promise<
    string | undefined
  > {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.DefaultTransferSourceAccount,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DefaultTransferSourceAccount,
            ),
          ],
        },
      },
    );

    return data?.value;
  }

  public static async updateDefaultTransferSourceAccount(
    newValue: string,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.DefaultTransferSourceAccount,
        value: newValue,
      },
    });

    await this.revalidateCache(
      UserPreferenceProperty.DefaultTransferSourceAccount,
    );
  }

  public static async getDefaultMarketUpdateSettings(): Promise<
    UserDefaultMarketUpdateSettings | undefined
  > {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.UpdateInvestmentMarketValue,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.UpdateInvestmentMarketValue,
            ),
          ],
        },
      },
    );

    return data?.value
      ? (JSON.parse(data.value) as UserDefaultMarketUpdateSettings)
      : undefined;
  }

  public static async updateDefaultMarketUpdateSettings(
    newValue: UserDefaultMarketUpdateSettings,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.UpdateInvestmentMarketValue,
        value: JSON.stringify(newValue),
      },
    });

    await this.revalidateCache(
      UserPreferenceProperty.UpdateInvestmentMarketValue,
    );
  }

  public static async getTransactionListChunkSize(): Promise<number> {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.TransactionListChunkSize,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.TransactionListChunkSize,
            ),
          ],
        },
      },
    );

    return data?.value ? parseInt(data.value) : 5;
  }

  public static async updateTransactionListChunkSize(
    newValue: number,
  ): Promise<void> {
    await this.client.PATCH('/api/user-preferences', {
      body: {
        key: UserPreferenceProperty.TransactionListChunkSize,
        value: newValue.toString(),
      },
    });

    await this.revalidateCache(UserPreferenceProperty.TransactionListChunkSize);
  }
}
