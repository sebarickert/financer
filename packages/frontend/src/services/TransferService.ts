import { IApiResponse, ITransaction } from '@local/types';

export const addTransfer = async (
  newTransactionData: ITransaction
): Promise<IApiResponse<ITransaction>> => {
  const newTransaction = await fetch('/api/transactions', {
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
  const updatedTransaction = await fetch(`/api/transactions/${id}`, {
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
  const transfers = await fetch('/api/transactions/transfers');
  return transfers.json();
};

export const getTransferById = async (id: string): Promise<ITransaction> => {
  const transfer = await fetch(`/api/transactions/${id}`);
  return (await transfer.json()).payload;
};

export const deleteTransfer = async (id: string): Promise<void> => {
  await fetch(`/api/transactions/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
