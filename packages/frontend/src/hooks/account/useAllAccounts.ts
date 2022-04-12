import { AccountDto, AccountType } from '@local/types';
import { useEffect, useState } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

import { getAllAccounts } from '../../services/AccountService';

export const useAllAccounts = (): UseQueryResult<AccountDto[]> => {
  return useQuery<AccountDto[]>('accounts', getAllAccounts, {
    staleTime: 300000,
  });
};

export const useAllAccountsByType = (
  types: AccountType[]
): [UseQueryResult<AccountDto[]>, (types: AccountType[]) => void] => {
  const {
    data: allAccounts,
    isLoading,
    ...allAccountsQuery
  } = useAllAccounts();
  const [targetAccounts, setTargetAccounts] = useState<AccountDto[]>();
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
      AccountDto[]
    >,
    setTargetTypes,
  ];
};
