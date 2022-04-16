import { IncomeDto } from '@local/types';
import { useQuery } from 'react-query';

import { getIncomeById } from '../../services/IncomeService';

export const useIncomeById = (id?: string): IncomeDto => {
  const { data, error } = useQuery(
    ['incomes', id],
    () => getIncomeById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
