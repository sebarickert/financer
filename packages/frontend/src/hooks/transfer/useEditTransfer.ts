import { UpdateTransferDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { updateTransfer } from '../../services/TransferService';

export const useEditTransfer = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (targetTransactionData: UpdateTransferDto, id: string) => {
      const editedTransaction = await updateTransfer(targetTransactionData, id);
      queryClient.invalidateQueries(['transfers']);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['transactionCategoryMappings']);
      queryClient.invalidateQueries(['accounts']);

      return editedTransaction;
    },
    [queryClient]
  );
};
