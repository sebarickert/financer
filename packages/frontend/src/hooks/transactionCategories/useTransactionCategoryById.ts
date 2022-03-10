import { useState, useEffect } from 'react';

import { useAllTransactionCategories } from './useAllTransactionCategories';

export const useTransactionCategoryById = (
  id: string | null = null
): [
  ITransactionCategory | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetId, setTargetId] = useState(id);
  const [targetTransactionCategory, setTargetTransactionCategory] =
    useState<ITransactionCategory | null>(null);
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    setTargetTransactionCategory(
      transactionCategories?.find(({ _id }) => _id === targetId) || null
    );
  }, [targetId, transactionCategories]);

  return [targetTransactionCategory, setTargetId];
};
