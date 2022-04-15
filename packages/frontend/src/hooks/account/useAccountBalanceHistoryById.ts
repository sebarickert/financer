import { AccountBalanceHistoryDto } from '@local/types';
import { useQuery } from 'react-query';

import { getAccountBalanceHistoryById } from '../../services/AccountService';

export const useAccountBalanceHistoryById = (
  id?: string
): AccountBalanceHistoryDto[] => {
  const { data } = useQuery(
    ['accounts', 'account-balance-history', id],
    () => getAccountBalanceHistoryById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  return data ?? [];
};
