import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getAllAccounts } from '../../services/AccountService';

export const useAllAccounts = (): IAccount[] | null => {
  const accountsQuery = useQuery<IAccount[]>('accounts', getAllAccounts, {
    staleTime: 300000,
  });

  return accountsQuery.data || null;
};

export const useAllAccountsByType = (
  types: IAccount['type'][]
): [IAccount[] | null, (types: IAccount['type'][]) => void] => {
  const allAccounts = useAllAccounts();
  const [targetAccounts, setTargetAccounts] = useState<IAccount[] | null>(null);
  const [targetTypes, setTargetTypes] = useState(types);

  useEffect(() => {
    if (!allAccounts) return;

    const newTargetAccounts = allAccounts.filter(({ type }) =>
      targetTypes.includes(type)
    );

    setTargetAccounts(newTargetAccounts);
  }, [allAccounts, targetTypes]);

  return [targetAccounts, setTargetTypes];
};
