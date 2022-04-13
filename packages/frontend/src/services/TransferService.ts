import {
  ApiResponse,
  CreateTransferDto,
  TransferDto,
  UpdateTransferDto,
} from '@local/types';

import { parseApiResponse } from '../utils/apiHelper';

export const addTransfer = async (
  newTransactionData: CreateTransferDto
): Promise<ApiResponse<TransferDto>> => {
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
  targetTransactionData: UpdateTransferDto,
  id: string
): Promise<ApiResponse<TransferDto>> => {
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

export const getAllTransfers = async (): Promise<TransferDto[]> => {
  const transfers = await fetch('/api/transfers');
  return transfers.json();
};

export const getTransferById = async (id: string): Promise<TransferDto> => {
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
