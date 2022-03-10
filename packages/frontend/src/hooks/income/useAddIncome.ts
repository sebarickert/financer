import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addIncome } from '../../services/IncomeService';

export const useAddIncome = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newIncomeData: IIncome) => {
      const newIncome = await addIncome(newIncomeData);
      queryClient.invalidateQueries('incomes');
      queryClient.invalidateQueries('transactions');
      queryClient.invalidateQueries('transactionCategoryMappings');
      queryClient.invalidateQueries('accounts');

      return newIncome;
    },
    [queryClient]
  );
};
