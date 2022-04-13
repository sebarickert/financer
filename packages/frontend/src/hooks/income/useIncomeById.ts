import { IncomeDto } from '@local/types';
import { useState, useEffect } from 'react';

import { useAllIncomes } from './useAllIncomes';

export const useIncomeById = (
  id: string | null = null
): [IncomeDto | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [targetId, setTargetId] = useState(id);
  const [targetIncome, setTargetIncome] = useState<IncomeDto | null>(null);
  const incomes = useAllIncomes();

  useEffect(() => {
    setTargetIncome(incomes?.find(({ _id }) => _id === targetId) || null);
  }, [targetId, incomes]);

  return [targetIncome, setTargetId];
};
