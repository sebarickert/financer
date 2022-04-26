import { AccountDto, AccountType, PaginationDto } from '@local/types';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getAllAccounts } from '../../services/AccountService';
import { TransactionFilterOptions } from '../../services/TransactionService';

export const useAllAccounts = (
  filterOptions: Omit<TransactionFilterOptions, 'month' | 'year'> = {}
): PaginationDto<AccountDto[]> => {
  const { data, error } = useQuery(['accounts', filterOptions], () =>
    getAllAccounts(filterOptions)
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};

export const useAllAccountsByType = (
  types: AccountType[]
): [AccountDto[], (types: AccountType[]) => void] => {
  const { data: accounts } = useAllAccounts();
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
