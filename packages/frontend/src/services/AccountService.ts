import { AccountBalanceHistoryDto, ApiResponse, IAccount } from '@local/types';

import { parseApiResponse } from '../utils/apiHelper';

export const getAllAccounts = async (): Promise<IAccount[]> => {
  const accounts = await fetch('/api/accounts');
  return accounts.json();
};

export const getAccountById = async (id: string): Promise<IAccount> => {
  const account = await fetch(`/api/accounts/${id}`);
  return account.json();
};

export const getAccountBalanceHistoryById = async (
  id: string
): Promise<AccountBalanceHistoryDto[]> => {
  const account = await fetch(`/api/accounts/${id}/balance-history`);
  return account.json();
};

export const addAccount = async (
  newAccountData: IAccount
): Promise<ApiResponse<IAccount>> => {
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
  targetAccountData: IAccount
): Promise<ApiResponse<IAccount>> => {
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
