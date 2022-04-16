import { AccountDto } from '@local/types';
import { useQuery } from 'react-query';

import { getAccountById } from '../../services/AccountService';

export const useAccountById = (id?: string): AccountDto => {
  const { data, error } = useQuery(
    ['accounts', id],
    () => getAccountById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
