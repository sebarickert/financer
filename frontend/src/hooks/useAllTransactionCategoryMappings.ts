import { useQuery } from 'react-query';

import { getAllUserTransactionCategoryMappings } from '../pages/profile/TransactionCategories/TransactionCategoriesService';

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
