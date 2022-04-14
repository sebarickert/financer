import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { deleteTransactionCategory } from '../../services/TransactionCategoriesService';

export const useDeleteTransactionCategory = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string) => {
      await deleteTransactionCategory(id);
      queryClient.invalidateQueries(['transactionCategories']);
    },
    [queryClient]
  );
};
