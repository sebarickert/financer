import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

import { AccountType, UserPreferenceProperty } from '@/api/ssr-financer-api';

interface UserDashboardSettings {
  accountTypes: AccountType[];
}

interface UserStatisticsSettings {
  accountTypes: AccountType[];
}

export interface UserDefaultMarketUpdateSettings {
  transactionDescription: string;
  category?: string;
}

export class UserPreferenceService extends BaseApi {
  public static revalidateCache(id?: UserPreferenceProperty): void {
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
            userPreferenceProperty: UserPreferenceProperty.DASHBOARD_SETTINGS,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DASHBOARD_SETTINGS,
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
        key: UserPreferenceProperty.DASHBOARD_SETTINGS,
        value: JSON.stringify(newValue),
      },
    });

    this.revalidateCache(UserPreferenceProperty.DASHBOARD_SETTINGS);
  }

  public static async getStatisticsSettings(): Promise<
    UserStatisticsSettings | undefined
  > {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty: UserPreferenceProperty.STATISTICS_SETTINGS,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.STATISTICS_SETTINGS,
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
        key: UserPreferenceProperty.STATISTICS_SETTINGS,
        value: JSON.stringify(newValue),
      },
    });

    this.revalidateCache(UserPreferenceProperty.STATISTICS_SETTINGS);
  }

  public static async getDefaultExpenseAccount(): Promise<string | undefined> {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
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
        key: UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
        value: newValue,
      },
    });

    this.revalidateCache(UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT);
  }

  public static async getDefaultIncomeAccount(): Promise<string | undefined> {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
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
        key: UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
        value: newValue,
      },
    });

    this.revalidateCache(UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT);
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
              UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
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
        key: UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
        value: newValue,
      },
    });

    this.revalidateCache(
      UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
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
              UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
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
        key: UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
        value: newValue,
      },
    });

    this.revalidateCache(
      UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
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
              UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE,
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
        key: UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE,
        value: JSON.stringify(newValue),
      },
    });

    this.revalidateCache(UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE);
  }

  public static async getTransactionListChunkSize(): Promise<number> {
    const { data } = await this.client.GET(
      '/api/user-preferences/{userPreferenceProperty}',
      {
        params: {
          path: {
            userPreferenceProperty:
              UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE,
          },
        },
        next: {
          tags: [
            this.getEntityTag(
              this.API_TAG.USER_PREFERENCE,
              UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE,
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
        key: UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE,
        value: newValue.toString(),
      },
    });

    this.revalidateCache(UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE);
  }
}
