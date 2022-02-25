import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addExpense } from '../services/ExpenseService';

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newExpenseData: IExpense) => {
      const newExpense = await addExpense(newExpenseData);
      queryClient.invalidateQueries('expenses');
      queryClient.invalidateQueries('transactions');

      return newExpense;
    },
    [queryClient]
  );
};
