import { useQuery } from 'react-query';

import { getAllTransactions } from '../../services/TransactionService';

export const useAllTransactions = () => {
  const transactionsQuery = useQuery(['transactions'], getAllTransactions);

  return transactionsQuery.data || null;
};
