import { ApiResponse, ITransaction } from '@local/types';

import { parseApiResponse } from '../utils/apiHelper';

export const addTransfer = async (
  newTransactionData: ITransaction
): Promise<ApiResponse<ITransaction>> => {
  const newTransaction = await fetch('/api/transfers', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTransactionData),
  });

  return parseApiResponse(newTransaction);
};

export const updateTransfer = async (
  targetTransactionData: ITransaction,
  id: string
): Promise<ApiResponse<ITransaction>> => {
  const updatedTransaction = await fetch(`/api/transfers/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetTransactionData),
  });

  return parseApiResponse(updatedTransaction);
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
