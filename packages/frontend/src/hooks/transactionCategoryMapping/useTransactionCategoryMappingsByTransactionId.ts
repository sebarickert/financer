import { ITransactionCategoryMapping } from '@local/types';
import { useState, useEffect } from 'react';

import { useAllTransactionCategoryMappings } from './useAllTransactionCategoryMappings';

export const useTransactionCategoryMappingsByTransactionId = (
  id: string | null = null
): [
  ITransactionCategoryMapping[] | null,
  React.Dispatch<React.SetStateAction<string | null>>
] => {
  const [targetId, setTargetId] = useState(id);
  const [
    targetTransactionCategoryMappings,
    setTargetTransactionCategoryMappings,
  ] = useState<ITransactionCategoryMapping[] | null>(null);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();

  useEffect(() => {
    setTargetTransactionCategoryMappings(
      transactionCategoryMappings?.filter(
        ({ transaction_id }) => transaction_id === targetId
      ) || null
    );
  }, [targetId, transactionCategoryMappings]);

  return [targetTransactionCategoryMappings, setTargetId];
};
