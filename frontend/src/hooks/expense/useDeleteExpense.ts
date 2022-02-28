import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { deleteExpense } from '../../services/ExpenseService';

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string) => {
      await deleteExpense(id);
      queryClient.invalidateQueries('expenses');
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('accounts');
    },
    [queryClient]
  );
};
