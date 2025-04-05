'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';

import {
  SchemaAccountBalanceHistoryDto,
  SchemaAccountDto,
  SchemaCreateAccountDto,
  SchemaUpdateAccountDto,
  operations,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateAccountCache = async (id?: string): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.ACCOUNT, id));
    return;
  }

  revalidateTag(API_TAG.ACCOUNT);
};

export const getAllAccounts = async (
  options: operations['Accounts_findAllByUser']['parameters']['query'] = {},
): Promise<SchemaAccountDto[]> => {
  const { data, error } = await client.GET('/api/accounts', {
    params: {
      query: options,
    },
    next: {
      tags: [
        API_TAG.ACCOUNT,
        API_TAG.TRANSACTION,
        API_TAG.INCOME,
        API_TAG.EXPENSE,
        API_TAG.TRANSFER,
      ],
    },
  });

  if (error) {
    throw new Error('Failed to fetch accounts', error);
  }

  return data as SchemaAccountDto[];
};

export const getAccountById = async (
  id: string,
): Promise<SchemaAccountDto | null> => {
  const { data } = await client.GET(`/api/accounts/{id}`, {
    params: {
      path: { id },
    },
    next: {
      tags: [
        API_TAG.ACCOUNT,
        API_TAG.TRANSACTION,
        API_TAG.INCOME,
        API_TAG.EXPENSE,
        API_TAG.TRANSFER,
        getEntityTag(API_TAG.ACCOUNT, id),
      ],
    },
  });

  return data ?? null;
};

export const getAccountsTotalBalance = async (
  dashboardSettings: operations['Accounts_findAllByUser']['parameters']['query'] = {
    accountTypes: undefined,
  },
): Promise<number> => {
  const accounts = await getAllAccounts({
    accountTypes: dashboardSettings.accountTypes,
  });

  return (
    accounts.reduce(
      (acc, { balance, currentDateBalance }) =>
        acc + (currentDateBalance ?? balance ?? 0),
      0,
    ) ?? NaN
  );
};

export const getAccountBalanceHistory = async (
  id: string,
): Promise<SchemaAccountBalanceHistoryDto[]> => {
  const { data } = await client.GET(`/api/accounts/{id}/balance-history`, {
    params: {
      path: { id },
    },
    next: {
      tags: [
        API_TAG.ACCOUNT,
        API_TAG.TRANSACTION,
        API_TAG.INCOME,
        API_TAG.EXPENSE,
        API_TAG.TRANSFER,
        getEntityTag(API_TAG.ACCOUNT, id),
      ],
    },
  });

  return data as SchemaAccountBalanceHistoryDto[];
};

export const addAccount = async (
  newAccount: SchemaCreateAccountDto,
): Promise<void> => {
  const { error } = await client.POST('/api/accounts', {
    body: newAccount,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add account',
        unknownError.message,
      );
    }

    throw new Error('Failed to add account', error);
  }

  await revalidateAccountCache();
};

export const updateAccount = async (
  id: string,
  updatedAccount: SchemaUpdateAccountDto,
): Promise<void> => {
  const { error } = await client.PATCH(`/api/accounts/{id}`, {
    params: {
      path: { id },
    },
    body: updatedAccount,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add account',
        unknownError.message,
      );
    }

    throw new Error('Failed to add account', error);
  }

  await revalidateAccountCache(id);
  await revalidateAccountCache();
};

export const deleteAccount = async (id: string): Promise<void> => {
  const { error } = await client.DELETE(`/api/accounts/{id}`, {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error('Failed to delete account', error);
  }

  await revalidateAccountCache();
};
