import { CreateExpenseDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addExpense } from '../../services/ExpenseService';

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newExpenseData: CreateExpenseDto) => {
      const newExpense = await addExpense(newExpenseData);
      queryClient.invalidateQueries(['expenses']);
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['transactionCategoryMappings']);
      queryClient.invalidateQueries(['accounts']);

      return newExpense;
    },
    [queryClient]
  );
};
