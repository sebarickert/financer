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

export const updateTransaction = async (
  targetTransactionData: ITransaction,
  id: string
): Promise<IApiResponse<ITransaction>> => {
  const updatedTransaction = await fetch(`/api/transaction/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetTransactionData),
  });

  return updatedTransaction.json();
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

export const getTransactionsByAccountId = async (
  id: string
): Promise<IApiResponse<ITransaction[]>> => {
  const transactions = await fetch(`/api/account/${id}/transactions`);
  return transactions.json();
};
