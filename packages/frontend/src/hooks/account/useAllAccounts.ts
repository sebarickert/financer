import { IAccount } from '@local/types';
import { useEffect, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

import { getAllAccounts } from '../../services/AccountService';

export const useAllAccounts = (): UseQueryResult<IAccount[]> => {
  return useQuery<IAccount[]>('accounts', getAllAccounts, {
    staleTime: 300000,
  });
};

export const useAllAccountsByType = (
  types: IAccount['type'][]
): [UseQueryResult<IAccount[]>, (types: IAccount['type'][]) => void] => {
  const {
    data: allAccounts,
    isLoading,
    ...allAccountsQuery
  } = useAllAccounts();
  const [targetAccounts, setTargetAccounts] = useState<IAccount[]>();
  const [targetTypes, setTargetTypes] = useState(types);

  useEffect(() => {
    if (!allAccounts || isLoading) {
      setTargetAccounts(undefined);
      return;
    }

    const newTargetAccounts = allAccounts.filter(({ type }) =>
      targetTypes.includes(type)
    );

    setTargetAccounts(newTargetAccounts ?? []);
  }, [allAccounts, isLoading, targetTypes]);

  return [
    { ...allAccountsQuery, isLoading, data: targetAccounts } as UseQueryResult<
      IAccount[]
    >,
    setTargetTypes,
  ];
};
