import { CreateTransactionCategoryDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addTransactionCategory } from '../../services/TransactionCategoriesService';

export const useAddTransactionCategory = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newTransactionCategoryData: CreateTransactionCategoryDto) => {
      const newTransactionCategory = await addTransactionCategory(
        newTransactionCategoryData
      );
      queryClient.invalidateQueries('transactionCategories');

      return newTransactionCategory;
    },
    [queryClient]
  );
};
