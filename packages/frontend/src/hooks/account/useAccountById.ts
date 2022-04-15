import { AccountDto } from '@local/types';
import { useQuery } from 'react-query';

import { getAccountById } from '../../services/AccountService';

export const useAccountById = (id?: string): AccountDto => {
  const { data } = useQuery(
    ['accounts', id],
    () => getAccountById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  return data ?? ({} as AccountDto);
};
