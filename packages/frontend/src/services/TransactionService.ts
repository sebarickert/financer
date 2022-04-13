import { TransactionDto } from '@local/types';

export const getAllTransactions = async (): Promise<TransactionDto[]> => {
  const transactions = await fetch('/api/transactions', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return transactions.json();
};

export const getTransactionsByAccountId = async (
  id: string
): Promise<TransactionDto[]> => {
  const transactions = await fetch(`/api/transactions/account/${id}`);
  return transactions.json();
};
