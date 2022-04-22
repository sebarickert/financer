import { TransactionMonthSummaryDto } from '@local/types';
import { useQuery } from 'react-query';

import { getExpenseMonthlySummaries } from '../../services/ExpenseService';

export const useExpenseMonthlySummaries = (): TransactionMonthSummaryDto[] => {
  const { data, error } = useQuery(
    ['expenses', 'expense-monthly-summaries'],
    () => getExpenseMonthlySummaries()
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
