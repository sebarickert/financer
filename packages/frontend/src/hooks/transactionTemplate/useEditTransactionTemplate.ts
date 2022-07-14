import { UpdateTransactionTemplateDto } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { editTransactionTemplate } from '../../services/TransactionTemplateService';

export const useEditTransactionTemplate = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (
      id: string,
      targetTransactionTemplateData: UpdateTransactionTemplateDto
    ) => {
      const editedTemplate = await editTransactionTemplate(
        id,
        targetTransactionTemplateData
      );
      queryClient.invalidateQueries(['transactionTemplates']);

      return editedTemplate;
    },
    [queryClient]
  );
};
