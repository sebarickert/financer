import { TransactionCategoryDto } from '@local/types';
import { useState, useEffect } from 'react';

import { useAllTransactionCategories } from './useAllTransactionCategories';

export const useTransactionCategoryById = (
  id: string | null = null
): [
  TransactionCategoryDto,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetId, setTargetId] = useState(id);
  const [targetTransactionCategory, setTargetTransactionCategory] =
    useState<TransactionCategoryDto>();
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    setTargetTransactionCategory(
      transactionCategories?.find(({ _id }) => _id === targetId)
    );
  }, [targetId, transactionCategories]);

  return [
    targetTransactionCategory ?? ({} as TransactionCategoryDto),
    setTargetId,
  ];
};
