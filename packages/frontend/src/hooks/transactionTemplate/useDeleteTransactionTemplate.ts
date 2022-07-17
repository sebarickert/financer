import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { deleteTransactionTemplate } from '../../services/TransactionTemplateService';

export const useDeleteTransactionTemplate = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (id: string) => {
      await deleteTransactionTemplate(id);
      queryClient.invalidateQueries(['transactionTemplates']);
    },
    [queryClient]
  );
};
