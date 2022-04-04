import { IAccount } from '@local/types';
import { useState, useEffect } from 'react';
import { UseQueryResult } from 'react-query';

import { useAllAccounts } from './useAllAccounts';

export const useAccountById = (
  id: string | null = null
): [
  UseQueryResult<IAccount>,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetId, setTargetId] = useState(id);
  const [targetAccount, setTargetAccount] = useState<IAccount>();
  const { data: accounts, isLoading, ...allAccountsQuery } = useAllAccounts();

  useEffect(() => {
    if (isLoading) {
      setTargetAccount(undefined);
      return;
    }
    setTargetAccount(accounts?.find(({ _id }) => _id === targetId));
  }, [targetId, accounts, isLoading]);

  return [
    {
      ...allAccountsQuery,
      isLoading,
      data: targetAccount,
    } as UseQueryResult<IAccount>,
    setTargetId,
  ];
};
