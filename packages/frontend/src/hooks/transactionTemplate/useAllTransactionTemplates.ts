import { TransactionTemplateDto } from '@local/types';
import { useQuery } from 'react-query';

import { getAllTransactionTemplates } from '../../services/TransactionTemplateService';

export const useAllTransactionTemplates = (): TransactionTemplateDto[] => {
  const { data, error } = useQuery(
    ['transactionTemplates'],
    getAllTransactionTemplates
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
