import { AccountBalanceHistoryDto } from '@local/types';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { getAccountBalanceHistoryById } from '../../services/AccountService';

export const useAccountBalanceHistoryById = (
  id: string | null = null
): [
  AccountBalanceHistoryDto[] | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetId, setTargetId] = useState(id);
  const balanceHistoryQuery = useQuery(
    ['account', 'account-balance-history', id],
    () => getAccountBalanceHistoryById(targetId ?? '')
  );

  return [balanceHistoryQuery.data ?? null, setTargetId];
};
