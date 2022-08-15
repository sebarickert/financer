import { TransactionMonthSummaryDto } from '@local/types';
import { useQuery } from 'react-query';

import {
  getTransactionsMonthlySummaries,
  TransactionFilterOptions,
} from '../../services/TransactionService';

export const useTransactionsMonthlySummaries = (
  filterOptions: Omit<TransactionFilterOptions, 'page'> = {}
): TransactionMonthSummaryDto[] => {
  const { data, error } = useQuery(
    ['transactions', 'transactions-monthly-summaries', filterOptions],
    () => getTransactionsMonthlySummaries(filterOptions)
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
