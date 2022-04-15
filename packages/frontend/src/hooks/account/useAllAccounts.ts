import { AccountDto, AccountType } from '@local/types';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getAllAccounts } from '../../services/AccountService';

export const useAllAccounts = (): AccountDto[] => {
  const { data } = useQuery<AccountDto[]>(['accounts'], getAllAccounts);

  return data ?? [];
};

export const useAllAccountsByType = (
  types: AccountType[]
): [AccountDto[], (types: AccountType[]) => void] => {
  const accounts = useAllAccounts();
  const [targetAccounts, setTargetAccounts] = useState<AccountDto[]>();
  const [targetTypes, setTargetTypes] = useState(types);

  useEffect(() => {
    if (!accounts) {
      setTargetAccounts(undefined);
      return;
    }

    const newTargetAccounts = accounts.filter(({ type }) =>
      targetTypes.includes(type)
    );

    setTargetAccounts(newTargetAccounts ?? []);
  }, [accounts, targetTypes]);

  return [targetAccounts ?? [], setTargetTypes];
};
