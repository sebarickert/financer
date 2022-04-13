import { UpdateTransactionCategoryDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { editTransactionCategory } from '../../services/TransactionCategoriesService';

export const useEditTransactionCategory = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (
      id: string,
      targetTransactionCategoryData: UpdateTransactionCategoryDto
    ) => {
      const editedExpense = await editTransactionCategory(
        id,
        targetTransactionCategoryData
      );
      queryClient.invalidateQueries('transactionCategories');

      return editedExpense;
    },
    [queryClient]
  );
};
