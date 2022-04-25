import { TransactionMonthSummaryDto } from '@local/types';
import { useQuery } from 'react-query';

import { getIncomeMonthlySummaries } from '../../services/IncomeService';
import { TransactionFilterOptions } from '../../services/TransactionService';

export const useIncomeMonthlySummaries = (
  filterOptions: Omit<TransactionFilterOptions, 'page'> = {}
): TransactionMonthSummaryDto[] => {
  const { data, error } = useQuery(
    ['incomes', 'income-monthly-summaries', filterOptions],
    () => getIncomeMonthlySummaries(filterOptions)
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
