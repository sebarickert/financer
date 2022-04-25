import { TransactionMonthSummaryDto } from '@local/types';
import { useQuery } from 'react-query';

import { TransactionFilterOptions } from '../../services/TransactionService';
import { getTransferMonthlySummaries } from '../../services/TransferService';

export const useTransferMonthlySummaries = (
  filterOptions: Omit<TransactionFilterOptions, 'page'> = {}
): TransactionMonthSummaryDto[] => {
  const { data, error } = useQuery(
    ['transfers', 'transfer-monthly-summaries', filterOptions],
    () => getTransferMonthlySummaries(filterOptions)
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
