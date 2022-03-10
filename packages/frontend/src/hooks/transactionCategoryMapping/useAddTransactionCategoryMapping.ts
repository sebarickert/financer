import { ITransactionCategoryMapping } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addTransactionCategoryMapping } from '../../services/TransactionCategoryMappingService';

export const useAddTransactionCategoryMapping = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (
      newTransactionCategoryMappingData: ITransactionCategoryMapping[]
    ) => {
      const newTransactionCategoryMappings =
        await addTransactionCategoryMapping(newTransactionCategoryMappingData);
      queryClient.invalidateQueries('transactionCategoryMappings');

      return newTransactionCategoryMappings;
    },
    [queryClient]
  );
};
