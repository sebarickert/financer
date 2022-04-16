import { ExpenseDto } from '@local/types';
import { useQuery } from 'react-query';

import { getExpenseById } from '../../services/ExpenseService';

export const useExpenseById = (id?: string): ExpenseDto => {
  const { data, error } = useQuery(
    ['expenses', `expense-id${id}`],
    () => getExpenseById(id ?? 'missing-id'),
    {
      enabled: Boolean(id),
    }
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};
