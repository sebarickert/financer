import { TransactionCategoryDto } from '@local/types';
import { useQuery } from 'react-query';

import { getTransactionCategoryById } from '../../services/TransactionCategoriesService';

export const useTransactionCategoryById = (
  id?: string
): TransactionCategoryDto => {
  const { data, error } = useQuery(
    ['transactionCategories', id],
    () => getTransactionCategoryById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  if (!data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }
  return data;
};
