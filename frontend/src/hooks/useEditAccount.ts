import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { editAccount } from '../pages/accounts/AccountService';

export const useEditAccount = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string, targetAccountData: IAccount) => {
      const editedAccount = await editAccount(id, targetAccountData);
      queryClient.invalidateQueries('accounts');

      return editedAccount;
    },
    [queryClient]
  );
};
