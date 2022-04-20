import { useQuery } from 'react-query';

import { getAllTransactions } from '../../services/TransactionService';

export const useAllTransactions = () => {
  const { data, error } = useQuery(['transactions'], getAllTransactions);

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
