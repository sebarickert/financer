import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addAccount } from '../pages/accounts/AccountService';

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newAccountData: IAccount) => {
      const newAccount = await addAccount(newAccountData);
      queryClient.invalidateQueries('accounts');

      return newAccount;
    },
    [queryClient]
  );
};
