'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';

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

export const revalidateUserPreferenceCache = async (
  id?: UserPreferenceProperty,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.USER_PREFERENCE, id));
    return;
  }

  revalidateTag(API_TAG.USER_PREFERENCE);
};

export const getDashboardSettings = async (): Promise<
  UserDashboardSettings | undefined
> => {
  const { data } = await client.GET(
    '/api/user-preferences/{userPreferenceProperty}',
    {
      params: {
        path: {
          userPreferenceProperty: UserPreferenceProperty.DASHBOARD_SETTINGS,
        },
      },
      next: {
        tags: [
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.DASHBOARD_SETTINGS,
          ),
        ],
      },
    },
  );

  return data?.value
    ? (JSON.parse(data.value) as UserDashboardSettings)
    : undefined;
};

export const updateDashboardSettings = async (
  newValue: UserDashboardSettings,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.DASHBOARD_SETTINGS,
      value: JSON.stringify(newValue),
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.DASHBOARD_SETTINGS,
  );
};

export const getStatisticsSettings = async (): Promise<
  UserStatisticsSettings | undefined
> => {
  const { data } = await client.GET(
    '/api/user-preferences/{userPreferenceProperty}',
    {
      params: {
        path: {
          userPreferenceProperty: UserPreferenceProperty.STATISTICS_SETTINGS,
        },
      },
      next: {
        tags: [
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.STATISTICS_SETTINGS,
          ),
        ],
      },
    },
  );

  return data?.value
    ? (JSON.parse(data.value) as UserStatisticsSettings)
    : undefined;
};

export const updateStatisticsSettings = async (
  newValue: UserStatisticsSettings,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.STATISTICS_SETTINGS,
      value: JSON.stringify(newValue),
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.STATISTICS_SETTINGS,
  );
};

export const getDefaultExpenseAccount = async (): Promise<
  string | undefined
> => {
  const { data } = await client.GET(
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
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
          ),
        ],
      },
    },
  );

  return data?.value;
};

export const updateDefaultExpenseAccount = async (
  newValue: string,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
      value: newValue,
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
  );
};

export const getDefaultIncomeAccount = async (): Promise<
  string | undefined
> => {
  const { data } = await client.GET(
    '/api/user-preferences/{userPreferenceProperty}',
    {
      params: {
        path: {
          userPreferenceProperty: UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
        },
      },
      next: {
        tags: [
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
          ),
        ],
      },
    },
  );

  return data?.value;
};

export const updateDefaultIncomeAccount = async (
  newValue: string,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
      value: newValue,
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
  );
};

export const getDefaultTransferTargetAccount = async (): Promise<
  string | undefined
> => {
  const { data } = await client.GET(
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
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
          ),
        ],
      },
    },
  );

  return data?.value;
};

export const updateDefaultTransferTargetAccount = async (
  newValue: string,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
      value: newValue,
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
  );
};

export const getDefaultTransferSourceAccount = async (): Promise<
  string | undefined
> => {
  const { data } = await client.GET(
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
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
          ),
        ],
      },
    },
  );

  return data?.value;
};

export const updateDefaultTransferSourceAccount = async (
  newValue: string,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
      value: newValue,
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
  );
};

export const getDefaultMarketUpdateSettings = async (): Promise<
  UserDefaultMarketUpdateSettings | undefined
> => {
  const { data } = await client.GET(
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
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE,
          ),
        ],
      },
    },
  );

  return data?.value
    ? (JSON.parse(data.value) as UserDefaultMarketUpdateSettings)
    : undefined;
};

export const updateDefaultMarketUpdateSettings = async (
  newValue: UserDefaultMarketUpdateSettings,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE,
      value: JSON.stringify(newValue),
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE,
  );
};

export const getTransactionListChunkSize = async (): Promise<number> => {
  const { data } = await client.GET(
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
          getEntityTag(
            API_TAG.USER_PREFERENCE,
            UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE,
          ),
        ],
      },
    },
  );

  return data?.value ? parseInt(data.value) : 5;
};

export const updateTransactionListChunkSize = async (
  newValue: number,
): Promise<void> => {
  await client.PATCH('/api/user-preferences', {
    body: {
      key: UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE,
      value: newValue.toString(),
    },
  });

  await revalidateUserPreferenceCache(
    UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE,
  );
};
