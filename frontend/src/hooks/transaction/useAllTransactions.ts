import { useQuery } from 'react-query';

import { getAllUserTransactions } from '../../services/TransactionService';

export const useAllTransactions = () => {
  const transactionsQuery = useQuery('transactions', getAllUserTransactions, {
    staleTime: 300000,
  });

  return transactionsQuery.data?.payload || null;
};
