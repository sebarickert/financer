import {
  ApiResponse,
  CreateTransferDto,
  PaginationDto,
  TransactionMonthSummaryDto,
  TransferDto,
  UpdateTransferDto,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

import {
  TransactionFilterOptions,
  parseFilterQueryString,
} from './TransactionService';

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

export const getAllTransfers = async (
  options: TransactionFilterOptions = {}
): Promise<PaginationDto<TransferDto[]>> => {
  const queryString = parseFilterQueryString(options);

  const transfers = await fetch(`/api/transfers?${queryString.join('&')}`);
  return parseJsonOrThrowError(transfers);
};

export const getTransferById = async (id: string): Promise<TransferDto> => {
  const transfer = await fetch(`/api/transfers/${id}`);
  return parseJsonOrThrowError(transfer);
};

export const getTransferMonthlySummaries = async (
  options: Omit<TransactionFilterOptions, 'page'> = {}
): Promise<TransactionMonthSummaryDto[]> => {
  const queryString = parseFilterQueryString(options);

  const transfer = await fetch(
    `/api/transfers/monthly-summaries?${queryString.join('&')}`
  );
  return parseJsonOrThrowError(transfer);
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
