import { TransactionDto } from '@local/types';

import { parseJsonOrThrowError } from '../utils/apiHelper';

export const getAllTransactions = async (): Promise<TransactionDto[]> => {
  const transactions = await fetch('/api/transactions', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return parseJsonOrThrowError(transactions);
};

export const getTransactionsByAccountId = async (
  id: string
): Promise<TransactionDto[]> => {
  const transactions = await fetch(`/api/transactions/account/${id}`);
  return parseJsonOrThrowError(transactions);
};
