import { PaginationDto, TransactionDto } from '@local/types';

import { parseJsonOrThrowError } from '../utils/apiHelper';

export type TransactionFilterOptions = {
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
};

export const parseFilterQueryString = ({
  year,
  month,
  page,
  limit,
}: TransactionFilterOptions): string[] => {
  const queryOptions: string[] = [];
  if (month && !year) {
    throw new Error(
      'Year must be defined when month is provided to Expense query'
    );
  }

  if (year) queryOptions.push(`year=${year}`);
  if (month) queryOptions.push(`month=${month}`);
  if (page) queryOptions.push(`page=${page}`);
  if (limit) queryOptions.push(`limit=${limit}`);

  return queryOptions;
};

export const getAllTransactions = async (
  options: TransactionFilterOptions = {}
): Promise<PaginationDto<TransactionDto[]>> => {
  const queryString = parseFilterQueryString(options);
  const transactions = await fetch(
    `/api/transactions?${queryString.join('&')}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return parseJsonOrThrowError(transactions);
};

export const getTransactionsByAccountId = async (
  id: string,
  options: TransactionFilterOptions = {}
): Promise<PaginationDto<TransactionDto[]>> => {
  const queryString = parseFilterQueryString(options);

  const transactions = await fetch(
    `/api/transactions/account/${id}?${queryString.join('&')}`
  );
  return parseJsonOrThrowError(transactions);
};
