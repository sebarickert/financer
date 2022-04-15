import { IncomeDto } from '@local/types';
import { useQuery } from 'react-query';

import { getIncomeById } from '../../services/IncomeService';

export const useIncomeById = (id?: string): IncomeDto => {
  const { data } = useQuery(
    ['incomes', `income-id-${id}`],
    () => getIncomeById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );
  return data ?? ({} as IncomeDto);
};
