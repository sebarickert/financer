import { UpdateAccountDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { editAccount } from '../../services/AccountService';

export const useEditAccount = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string, targetAccountData: UpdateAccountDto) => {
      const editedAccount = await editAccount(id, targetAccountData);
      queryClient.invalidateQueries(['accounts']);

      return editedAccount;
    },
    [queryClient]
  );
};
