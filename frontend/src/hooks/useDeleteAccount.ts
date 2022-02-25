import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { deleteAccount } from '../pages/accounts/AccountService';

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string) => {
      deleteAccount(id);
      queryClient.invalidateQueries('accounts');
    },
    [queryClient]
  );
};
