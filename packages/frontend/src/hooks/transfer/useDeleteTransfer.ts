import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { deleteTransfer } from '../../services/TransferService';

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string) => {
      await deleteTransfer(id);
      queryClient.invalidateQueries(['transfers']);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['accounts']);
    },
    [queryClient]
  );
};
