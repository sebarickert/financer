import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { updateTransaction } from '../../services/TransactionService';

export const useEditTransaction = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (targetTransactionData: ITransaction, id: string) => {
      const editedTransaction = await updateTransaction(
        targetTransactionData,
        id
      );
      queryClient.invalidateQueries('transfers');
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('transactionCategoryMappings');

      return editedTransaction;
    },
    [queryClient]
  );
};
