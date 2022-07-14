import { CreateTransactionTemplateDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { addTransactionTemplate } from '../../services/TransactionTemplateService';

export const useAddTransactionTemplate = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (newTransactionTemplateData: CreateTransactionTemplateDto) => {
      const newTransactionCategory = await addTransactionTemplate(
        newTransactionTemplateData
      );
      queryClient.invalidateQueries(['transactionTemplates']);

      return newTransactionCategory;
    },
    [queryClient]
  );
};
