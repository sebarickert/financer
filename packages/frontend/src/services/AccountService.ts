import { IAccount, IApiResponse } from '@local/types';

export const getAllAccounts = async (): Promise<IAccount[]> => {
  const accounts = await fetch('/api/accounts');
  return accounts.json();
};

export const getAccountById = async (id: string): Promise<IAccount> => {
  const account = await fetch(`/api/accounts/${id}`);
  return (await account.json()).payload;
};

export const addAccount = async (
  newAccountData: IAccount
): Promise<IApiResponse<IAccount>> => {
  const newAccount = await fetch('/api/accounts', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAccountData),
  });

  return newAccount.json();
};

export const editAccount = async (
  id: string,
  targetAccountData: IAccount
): Promise<IApiResponse<IAccount>> => {
  const targetAccount = await fetch(`/api/accounts/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetAccountData),
  });

  return targetAccount.json();
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
