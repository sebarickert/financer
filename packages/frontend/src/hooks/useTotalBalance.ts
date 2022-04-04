import { useState, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

import { useAllAccounts } from './account/useAllAccounts';

export const useTotalBalance = (): UseQueryResult<number> => {
  const { data: accounts, isLoading, ...allAccountQuery } = useAllAccounts();
  const [totalBalance, setTotalBalance] = useState<number>(NaN);

  useEffect(() => {
    if (!accounts || isLoading) {
      setTotalBalance(NaN);
      return;
    }

    const total = accounts.reduce(
      (currentTotal, { balance, type }) =>
        currentTotal + (type !== 'loan' ? balance : 0),
      0
    );

    setTotalBalance(total);
  }, [accounts, isLoading]);

  return {
    ...allAccountQuery,
    isLoading,
    data: totalBalance,
  } as UseQueryResult<number>;
};
