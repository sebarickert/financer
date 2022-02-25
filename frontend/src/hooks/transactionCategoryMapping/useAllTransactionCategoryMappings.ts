import { useQuery } from 'react-query';

import { getAllUserTransactionCategoryMappings } from '../../services/TransactionCategoryMappingService';

export const useAllTransactionCategoryMappings = () => {
  const transactionCategoryMappingsQuery = useQuery(
    'transactionCategoryMappings',
    getAllUserTransactionCategoryMappings,
    {
      staleTime: 300000,
    }
  );

  return transactionCategoryMappingsQuery.data || [];
};
