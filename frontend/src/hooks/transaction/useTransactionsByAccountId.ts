import { useState } from 'react';

import { useAllTransactions } from './useAllTransactions';

export const useTransactionsByAccountId = (
  accountId: string | null = null
): [
  ITransaction[] | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetAccountId, setTargetId] = useState(accountId);
  const accounts = useAllTransactions();

  const targetAccount = !targetAccountId
    ? null
    : accounts?.filter(
        ({ fromAccount, toAccount }) =>
          fromAccount === targetAccountId || toAccount === targetAccountId
      ) || null;

  return [targetAccount, setTargetId];
};
