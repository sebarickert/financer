import { AccountDto, ApiResponse, UpdateAccountDto } from '@local/types';

import { parseApiResponse } from '../utils/apiHelper';

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
