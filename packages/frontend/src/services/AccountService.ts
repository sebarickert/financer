import {
  AccountBalanceHistoryDto,
  AccountDto,
  ApiResponse,
  CreateAccountDto,
  UpdateAccountDto,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

export const getAllAccounts = async (): Promise<AccountDto[]> => {
  const accounts = await fetch('/api/accounts');
  return parseJsonOrThrowError(accounts);
};

export const getAccountById = async (id: string): Promise<AccountDto> => {
  const account = await fetch(`/api/accounts/${id}`);
  return parseJsonOrThrowError(account);
};

export const getAccountBalanceHistoryById = async (
  id: string
): Promise<AccountBalanceHistoryDto[]> => {
  const account = await fetch(`/api/accounts/${id}/balance-history`);
  return parseJsonOrThrowError(account);
};

export const addAccount = async (
  newAccountData: CreateAccountDto
): Promise<ApiResponse<AccountDto>> => {
  const newAccount = await fetch('/api/accounts', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAccountData),
  });

  return parseApiResponse(newAccount);
};

export const editAccount = async (
  id: string,
  targetAccountData: UpdateAccountDto
): Promise<ApiResponse<AccountDto>> => {
  const targetAccount = await fetch(`/api/accounts/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetAccountData),
  });

  return parseApiResponse(targetAccount);
};

export const deleteAccount = async (id: string): Promise<void> => {
  await fetch(`/api/accounts/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
