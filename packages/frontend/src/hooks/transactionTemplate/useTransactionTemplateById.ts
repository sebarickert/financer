import { TransactionTemplateDto } from '@local/types';
import { useQuery } from 'react-query';

import { getTransactionTemplateById } from '../../services/TransactionTemplateService';

export const useTransactionTemplateById = (
  id?: string
): TransactionTemplateDto => {
  const { data, error } = useQuery(
    ['transactionTemplates', id],
    () => getTransactionTemplateById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  if (!data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }
  return data;
};
