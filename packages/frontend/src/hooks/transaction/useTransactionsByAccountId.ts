import { ITransaction } from '@local/types';
import { useEffect, useState } from 'react';

import { useAllTransactions } from './useAllTransactions';

export const useTransactionsByAccountId = (
  accountId: string | null = null
): [
  ITransaction[] | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetAccountId, setTargetId] = useState(accountId);
  const [targetAccountTransactions, setTargetAccountTransactions] = useState<
    ITransaction[] | null
  >(null);
  const transactions = useAllTransactions();

  useEffect(() => {
    setTargetAccountTransactions(
      transactions?.filter(
        ({ toAccount, fromAccount }) =>
          fromAccount === targetAccountId || toAccount === targetAccountId
      ) || null
    );
  }, [targetAccountId, transactions]);

  return [targetAccountTransactions, setTargetId];
};
