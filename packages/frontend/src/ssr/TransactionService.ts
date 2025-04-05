'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';
import { getAllExpenses } from './ExpenseService';
import { getAllIncomes } from './IncomeService';
import { getAllTransfers } from './TransferService';

import {
  SchemaExpenseListItemDto,
  SchemaIncomeListItemDto,
  SchemaTransactionDetailsDto,
  SchemaTransactionListItemDto,
  SchemaTransactionMonthSummaryDto,
  SchemaTransferListItemDto,
  SortOrder,
  TransactionType,
  operations,
} from '@/api/ssr-financer-api';

export type TransactionListOptions =
  operations['Transactions_findAllByUser']['parameters']['query'];

export type FirstTransactionByTypeOptions = Omit<
  TransactionListOptions,
  'limit' | 'sortOrder'
>;

export const revalidateTransactionCache = async (
  id?: string,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.TRANSACTION, id));
    return;
  }

  revalidateTag(API_TAG.TRANSACTION);
};

export const getTransactionMonthlySummary = async (
  params: operations['Transactions_findMonthlySummariesByUser']['parameters']['query'],
): Promise<readonly SchemaTransactionMonthSummaryDto[]> => {
  const { data, error } = await client.GET(
    '/api/transactions/monthly-summaries',
    {
      params: {
        query: params,
      },
      next: {
        tags: [
          API_TAG.TRANSACTION,
          API_TAG.EXPENSE,
          API_TAG.INCOME,
          API_TAG.TRANSFER,
        ],
      },
    },
  );

  if (error) {
    throw new Error('Failed to fetch monthly summaries', error);
  }

  return data;
};

export async function getFirstTransactionByType(
  type?: TransactionType.EXPENSE,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaExpenseListItemDto | null>;
export async function getFirstTransactionByType(
  type?: TransactionType.INCOME,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaIncomeListItemDto | null>;
export async function getFirstTransactionByType(
  type?: TransactionType.TRANSFER,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaTransferListItemDto | null>;
export async function getFirstTransactionByType(
  type?: null,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaTransactionListItemDto | null>;
export async function getFirstTransactionByType(
  type: TransactionType | null = null,
  options: FirstTransactionByTypeOptions = {},
): Promise<
  | SchemaTransactionListItemDto
  | SchemaExpenseListItemDto
  | SchemaIncomeListItemDto
  | SchemaTransferListItemDto
  | null
> {
  // @ts-expect-error - TS is not able to infer the type of data with null overload
  const data = await getAllTransactionsByType(type, {
    ...options,
    limit: 1,
    sortOrder: SortOrder.asc,
  });

  return data.at(0) ?? null;
}

export async function getLatestTransactionByType(
  type?: TransactionType.EXPENSE,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaExpenseListItemDto | null>;
export async function getLatestTransactionByType(
  type?: TransactionType.INCOME,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaIncomeListItemDto | null>;
export async function getLatestTransactionByType(
  type?: TransactionType.TRANSFER,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaTransferListItemDto | null>;
export async function getLatestTransactionByType(
  type?: null,
  options?: FirstTransactionByTypeOptions,
): Promise<SchemaTransactionListItemDto | null>;
export async function getLatestTransactionByType(
  type: TransactionType | null = null,
  options: FirstTransactionByTypeOptions = {},
): Promise<
  | SchemaTransactionListItemDto
  | SchemaExpenseListItemDto
  | SchemaIncomeListItemDto
  | SchemaTransferListItemDto
  | null
> {
  // @ts-expect-error - TS is not able to infer the type of data with null overload
  const data = await getAllTransactionsByType(type, {
    ...options,
    limit: 1,
    sortOrder: SortOrder.desc,
  });

  return data.at(0) ?? null;
}

export async function getAllTransactionsByType(
  type: TransactionType.EXPENSE,
  options?: TransactionListOptions,
): Promise<SchemaExpenseListItemDto[]>;
export async function getAllTransactionsByType(
  type: TransactionType.INCOME,
  options?: TransactionListOptions,
): Promise<SchemaIncomeListItemDto[]>;
export async function getAllTransactionsByType(
  type: TransactionType.TRANSFER,
  options?: TransactionListOptions,
): Promise<SchemaTransferListItemDto[]>;
export async function getAllTransactionsByType(
  type: null,
  options?: TransactionListOptions,
): Promise<SchemaTransactionListItemDto[]>;
export async function getAllTransactionsByType(
  type: TransactionType | null,
  options: TransactionListOptions = {},
): Promise<
  | SchemaTransactionListItemDto[]
  | SchemaExpenseListItemDto[]
  | SchemaIncomeListItemDto[]
  | SchemaTransferListItemDto[]
> {
  if (type === TransactionType.EXPENSE) {
    return getAllExpenses(options);
  } else if (type === TransactionType.INCOME) {
    return getAllIncomes(options);
  } else if (type === TransactionType.TRANSFER) {
    return getAllTransfers(options);
  }
  return getAll(options);
}

const getAll = async (
  options: TransactionListOptions,
): Promise<SchemaTransactionListItemDto[]> => {
  const { data, error } = await client.GET('/api/transactions', {
    params: {
      query: options,
    },
    next: {
      tags: [
        API_TAG.TRANSACTION,
        API_TAG.EXPENSE,
        API_TAG.INCOME,
        API_TAG.TRANSFER,
      ],
    },
  });

  if (error) {
    throw new Error('Failed to fetch transactions', error);
  }

  return data as unknown as SchemaTransactionListItemDto[];
};

export const getTransactionById = async (
  id: string,
): Promise<SchemaTransactionDetailsDto> => {
  const { data, error } = await client.GET(`/api/transactions/{id}`, {
    params: {
      path: {
        id,
      },
    },
    next: {
      tags: [
        getEntityTag(API_TAG.TRANSACTION, id),
        getEntityTag(API_TAG.EXPENSE, id),
        getEntityTag(API_TAG.INCOME, id),
        getEntityTag(API_TAG.TRANSFER, id),
      ],
    },
  });

  if (error) {
    throw new Error('Failed to fetch transaction', error);
  }

  return data;
};
