import { AccountDto, TransactionDto, UserDto } from '@local/types';

import { parseJsonOrThrowError } from '../utils/apiHelper';

export interface IOverrideProfileData {
  accounts: AccountDto[];
  transactions: TransactionDto[];
  user: UserDto;
}

export const getProfileInformation = async (): Promise<UserDto> => {
  const profile = await fetch('/api/users/my-user');
  return parseJsonOrThrowError(profile);
};

export const postOverrideProfileData = async (
  uploadedUserData: IOverrideProfileData
): Promise<{ message: string; status: number }> => {
  const rawOverride = await fetch('/api/users/my-user/my-data', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(uploadedUserData),
  });

  const { payload: message } = await rawOverride.json();

  return { message, status: rawOverride.status };
};
