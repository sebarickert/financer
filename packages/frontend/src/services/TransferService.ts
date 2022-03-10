export const addTransfer = async (
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

export const updateTransfer = async (
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

export const getAllTransferTranscations = async (): Promise<
  IApiResponse<ITransaction[]>
> => {
  const transfers = await fetch('/api/transaction/transfers');
  return transfers.json();
};

export const getTransferById = async (id: string): Promise<ITransaction> => {
  const transfer = await fetch(`/api/transaction/${id}`);
  return (await transfer.json()).payload;
};

export const deleteTransfer = async (id: string): Promise<void> => {
  await fetch(`/api/transaction/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
