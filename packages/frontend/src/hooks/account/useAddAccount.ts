import { CreateAccountDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addAccount } from '../../services/AccountService';

export const useAddAccount = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newAccountData: CreateAccountDto) => {
      const newAccount = await addAccount(newAccountData);
      queryClient.invalidateQueries(['accounts']);

      return newAccount;
    },
    [queryClient]
  );
};
