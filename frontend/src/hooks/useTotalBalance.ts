import { useState, useEffect } from 'react';

import { useAllAccounts } from './useAllAccounts';

export const useTotalBalance = (): number => {
  const accounts = useAllAccounts();
  const [totalBalance, setTotalBalance] = useState<number>(NaN);

  useEffect(() => {
    if (accounts === null) return;

    const total = accounts.reduce(
      (currentTotal, { balance, type }) =>
        currentTotal + (type !== 'loan' ? balance : 0),
      0
    );

    setTotalBalance(total);
  }, [accounts]);

  return totalBalance;
};
