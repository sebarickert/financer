import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { updateExpense } from '../../services/ExpenseService';

export const useEditExpense = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (targetAccountData: IExpense, id: string) => {
      const editedExpense = await updateExpense(targetAccountData, id);
      queryClient.invalidateQueries('expenses');
      queryClient.invalidateQueries('transactions');

      return editedExpense;
    },
    [queryClient]
  );
};
