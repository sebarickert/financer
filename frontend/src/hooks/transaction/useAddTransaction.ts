import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addTransaction } from '../../services/TransactionService';

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newTransactionData: ITransaction) => {
      const newTransaction = await addTransaction(newTransactionData);
      queryClient.invalidateQueries('transfers');
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('transactionCategoryMappings');

      return newTransaction;
    },
    [queryClient]
  );
};
