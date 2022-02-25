import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { updateIncome } from '../../services/IncomeService';

export const useEditIncome = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (targetAccountData: IIncome, id: string) => {
      const editedExpense = await updateIncome(targetAccountData, id);
      queryClient.invalidateQueries('incomes');
      queryClient.invalidateQueries('transactions');

      return editedExpense;
    },
    [queryClient]
  );
};
