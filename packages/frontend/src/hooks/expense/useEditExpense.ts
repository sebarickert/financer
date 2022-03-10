import { IExpense } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { updateExpense } from '../../services/ExpenseService';

export const useEditExpense = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (targetExpenseData: IExpense, id: string) => {
      const editedExpense = await updateExpense(targetExpenseData, id);
      queryClient.invalidateQueries('expenses');
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('transactionCategoryMappings');
      queryClient.invalidateQueries('accounts');

      return editedExpense;
    },
    [queryClient]
  );
};
