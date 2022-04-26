import { useState, useEffect } from 'react';

import { TransactionFilterOptions } from '../services/TransactionService';

import { useAllAccounts } from './account/useAllAccounts';

export const useTotalBalance = (
  filterOptions: Pick<TransactionFilterOptions, 'accountTypes'> = {}
): number => {
  const { data: accounts } = useAllAccounts(filterOptions);
  const [totalBalance, setTotalBalance] = useState<number>(NaN);

  useEffect(() => {
    if (!accounts.length) {
      setTotalBalance(NaN);
      return;
    }

    const total = accounts.reduce(
      (currentTotal, { balance }) => currentTotal + balance,
      0
    );

    setTotalBalance(total);
  }, [accounts]);

  return totalBalance;
};
