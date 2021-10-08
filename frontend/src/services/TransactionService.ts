export const addTransaction = async (
  newTransactionData: ITransaction
): Promise<IApiResponse<ITransaction>> => {
  const newTransaction = await fetch('/api/transaction', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTransactionData),
  });

  return newTransaction.json();
};

export const getAllUserTransactions = async (): Promise<
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
