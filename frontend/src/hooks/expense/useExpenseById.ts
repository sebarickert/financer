import { useState, useEffect } from 'react';

import { useAllExpenses } from './useAllExpenses';

export const useExpenseById = (
  id: string | null = null
): [IExpense | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [targetId, setTargetId] = useState(id);
  const [targetExpense, setTargetAccount] = useState<IExpense | null>(null);
  const expenses = useAllExpenses();

  useEffect(() => {
    setTargetAccount(expenses?.find(({ _id }) => _id === targetId) || null);
  }, [targetId, expenses]);

  return [targetExpense, setTargetId];
};
