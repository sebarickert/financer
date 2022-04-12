import { AccountDto, ITransaction, IUser } from '@local/types';

export interface IOverrideProfileData {
  accounts: AccountDto[];
  transactions: ITransaction[];
  user: IUser;
}

export const getProfileInformation = async (): Promise<IUser> => {
  const profile = await fetch('/api/users/my-user');
  return profile.json();
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
