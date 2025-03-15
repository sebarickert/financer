'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';
import {
  type FirstTransactionByTypeOptions,
  type TransactionListOptions,
} from './TransactionService';

import {
  SchemaCreateExpenseDto,
  SchemaExpenseDetailsDto,
  SchemaExpenseListItemDto,
  SchemaUpdateExpenseDto,
  SortOrder,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateExpenseCache = async (id?: string): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.EXPENSE, id));
    return;
  }

  revalidateTag(API_TAG.EXPENSE);
};

export const getFirstExpense = async (
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaExpenseListItemDto> => {
  const data = await getAllExpenses({
    ...options,
    limit: 1,
    sortOrder: SortOrder.asc,
  });

  return data[0];
};

export const getAllExpenses = async (
  options: TransactionListOptions,
): Promise<SchemaExpenseListItemDto[]> => {
  const { data, error } = await client.GET('/api/expenses', {
    params: {
      query: options,
    },
    next: {
      tags: [API_TAG.EXPENSE],
    },
  });

  if (error) {
    throw new Error('Failed to fetch expenses', error);
  }

  return data as SchemaExpenseListItemDto[];
};

export const getExpenseById = async (
  id: string,
): Promise<SchemaExpenseDetailsDto> => {
  const { data, error } = await client.GET(`/api/expenses/{id}`, {
    params: {
      path: {
        id,
      },
    },
    next: {
      tags: [getEntityTag(API_TAG.EXPENSE, id)],
    },
  });

  if (error) {
    throw new Error('Failed to fetch expense', error);
  }

  return data;
};

export const addExpense = async (
  newExpense: SchemaCreateExpenseDto,
): Promise<SchemaExpenseDetailsDto> => {
  const { error, data } = await client.POST('/api/expenses', {
    body: newExpense,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add expense',
        unknownError.message,
      );
    }

    throw new Error('Failed to add expense', error);
  }

  await revalidateExpenseCache();

  return data;
};

export const updateExpense = async (
  id: string,
  updatedExpense: SchemaUpdateExpenseDto,
): Promise<SchemaExpenseDetailsDto> => {
  const { error, data } = await client.PATCH(`/api/expenses/{id}`, {
    params: {
      path: { id },
    },
    body: updatedExpense,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to add expense',
        unknownError.message,
      );
    }

    throw new Error('Failed to add expense', error);
  }

  await revalidateExpenseCache(id);
  await revalidateExpenseCache();

  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await client.DELETE(`/api/expenses/{id}`, {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error('Failed to delete expense', error);
  }

  await revalidateExpenseCache();
};
