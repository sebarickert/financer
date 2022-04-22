import { TransactionMonthSummaryDto } from '@local/types';
import { useQuery } from 'react-query';

import { getIncomeMonthlySummaries } from '../../services/IncomeService';

export const useIncomeMonthlySummaries = (): TransactionMonthSummaryDto[] => {
  const { data, error } = useQuery(
    ['incomes', 'income-monthly-summaries'],
    () => getIncomeMonthlySummaries()
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
