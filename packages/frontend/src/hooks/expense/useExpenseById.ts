import { ExpenseDto } from '@local/types';
import { useQuery } from 'react-query';

import { getExpenseById } from '../../services/ExpenseService';

export const useExpenseById = (id?: string): ExpenseDto => {
  const { data } = useQuery(
    ['expenses', `expense-id${id}`],
    () => getExpenseById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  return data ?? ({} as ExpenseDto);
};
