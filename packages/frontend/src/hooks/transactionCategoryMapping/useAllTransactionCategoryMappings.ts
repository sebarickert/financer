import { useQuery } from 'react-query';

import { getAllTransactionCategoryMappings } from '../../services/TransactionCategoryMappingService';

export const useAllTransactionCategoryMappings = () => {
  const { data, error } = useQuery(
    ['transactionCategoryMappings'],
    getAllTransactionCategoryMappings
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
