import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addTransfer } from '../../services/TransferService';

export const useAddTransfer = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newTransactionData: ITransaction) => {
      const newTransaction = await addTransfer(newTransactionData);
      queryClient.invalidateQueries('transfers');
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('transactionCategoryMappings');
      queryClient.invalidateQueries('accounts');

      return newTransaction;
    },
    [queryClient]
  );
};
