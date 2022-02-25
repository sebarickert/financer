import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { deleteAccount } from '../../services/AccountService';

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string) => {
      await deleteAccount(id);
      queryClient.invalidateQueries('accounts');
    },
    [queryClient]
  );
};
