import { useQuery } from 'react-query';

import { getAllTransactionCategoryMappings } from '../../services/TransactionCategoryMappingService';

export const useAllTransactionCategoryMappings = () => {
  const transactionCategoryMappingsQuery = useQuery(
    ['transactionCategoryMappings'],
    getAllTransactionCategoryMappings
  );

  return transactionCategoryMappingsQuery.data || [];
};
