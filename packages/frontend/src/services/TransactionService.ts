export const getAllTransactions = async (): Promise<
  IApiResponse<ITransaction[]>
> => {
  const transactions = await fetch('/api/transaction', {
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
  const transactions = await fetch(`/api/account/${id}/transactions`);
  return transactions.json();
};
