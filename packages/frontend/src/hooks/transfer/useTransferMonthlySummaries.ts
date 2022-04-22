import { TransactionMonthSummaryDto } from '@local/types';
import { useQuery } from 'react-query';

import { getTransferMonthlySummaries } from '../../services/TransferService';

export const useTransferMonthlySummaries = (): TransactionMonthSummaryDto[] => {
  const { data, error } = useQuery(
    ['transfers', 'transfer-monthly-summaries'],
    () => getTransferMonthlySummaries()
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
