import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { deleteIncome } from '../../services/IncomeService';

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string) => {
      await deleteIncome(id);
      queryClient.invalidateQueries('incomes');
      queryClient.invalidateQueries('transactions');
    },
    [queryClient]
  );
};
