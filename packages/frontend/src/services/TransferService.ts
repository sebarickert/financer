import { ApiResponseWithStatus, ITransaction } from '@local/types';

export const addTransfer = async (
  newTransactionData: ITransaction
): Promise<ApiResponseWithStatus<ITransaction>> => {
  const newTransaction = await fetch('/api/transfers', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTransactionData),
  });

  return {
    payload: await newTransaction.json(),
    status: newTransaction.status,
  };
};

export const updateTransfer = async (
  targetTransactionData: ITransaction,
  id: string
): Promise<ApiResponseWithStatus<ITransaction>> => {
  const updatedTransaction = await fetch(`/api/transfers/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetTransactionData),
  });

  return {
    payload: await updatedTransaction.json(),
    status: updatedTransaction.status,
  };
};

export const getAllTransferTranscations = async (): Promise<ITransaction[]> => {
  const transfers = await fetch('/api/transfers');
  return transfers.json();
};

export const getTransferById = async (id: string): Promise<ITransaction> => {
  const transfer = await fetch(`/api/transfers/${id}`);
  return transfer.json();
};

export const deleteTransfer = async (id: string): Promise<void> => {
  await fetch(`/api/transfers/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
