'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';
import type {
  FirstTransactionByTypeOptions,
  TransactionListOptions,
} from './TransactionService';

import {
  SchemaCreateIncomeDto,
  SchemaIncomeDetailsDto,
  SchemaIncomeListItemDto,
  SchemaUpdateIncomeDto,
  SortOrder,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateIncomeCache = async (id?: string): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.INCOME, id));
    return;
  }

  revalidateTag(API_TAG.INCOME);
};

export const getFirstIncome = async (
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaIncomeListItemDto> => {
  const data = await getAllIncomes({
    ...options,
    limit: 1,
    sortOrder: SortOrder.asc,
  });

  return data[0];
};

export const getAllIncomes = async (
  options: TransactionListOptions,
): Promise<SchemaIncomeDetailsDto[]> => {
  const { data, error } = await client.GET('/api/incomes', {
    params: {
      query: options,
    },
    next: {
      tags: [API_TAG.INCOME],
    },
  });

  if (error) {
    throw new Error('Failed to fetch incomes', error);
  }

  return data as SchemaIncomeDetailsDto[];
};

export const getIncomeById = async (
  id: string,
): Promise<SchemaIncomeDetailsDto> => {
  const { data, error } = await client.GET(`/api/incomes/{id}`, {
    params: {
      path: {
        id,
      },
    },
    next: {
      tags: [getEntityTag(API_TAG.INCOME, id)],
    },
  });

  if (error) {
    throw new Error('Failed to fetch income', error);
  }

  return data;
};

export const addIncome = async (
  newIncome: SchemaCreateIncomeDto,
): Promise<SchemaIncomeDetailsDto> => {
  const { error, data } = await client.POST('/api/incomes', {
    body: newIncome,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add income',
        unknownError.message,
      );
    }

    throw new Error('Failed to add income', error);
  }

  await revalidateIncomeCache();

  return data;
};

export const updateIncome = async (
  id: string,
  updatedIncome: SchemaUpdateIncomeDto,
): Promise<SchemaIncomeDetailsDto> => {
  const { error, data } = await client.PATCH(`/api/incomes/{id}`, {
    params: {
      path: { id },
    },
    body: updatedIncome,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add income',
        unknownError.message,
      );
    }

    throw new Error('Failed to add income', error);
  }

  await revalidateIncomeCache(id);
  await revalidateIncomeCache();

  return data;
};

export const deleteIncome = async (id: string): Promise<void> => {
  const { error } = await client.DELETE(`/api/incomes/{id}`, {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error('Failed to delete income', error);
  }

  await revalidateIncomeCache();
};
