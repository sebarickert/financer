import { IApiResponse, ITransaction } from '@local/types';

export const getAllTransactions = async (): Promise<
  IApiResponse<ITransaction[]>
> => {
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
): Promise<IApiResponse<ITransaction[]>> => {
  const transactions = await fetch(`/api/accounts/${id}/transactions`);
  return transactions.json();
};
