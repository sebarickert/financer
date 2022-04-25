import { TransactionMonthSummaryDto } from '@local/types';
import { useQuery } from 'react-query';

import { getExpenseMonthlySummaries } from '../../services/ExpenseService';
import { TransactionFilterOptions } from '../../services/TransactionService';

export const useExpenseMonthlySummaries = (
  filterOptions: Omit<TransactionFilterOptions, 'page'> = {}
): TransactionMonthSummaryDto[] => {
  const { data, error } = useQuery(
    ['expenses', 'expense-monthly-summaries', filterOptions],
    () => getExpenseMonthlySummaries(filterOptions)
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
