import { useCallback } from 'react';

import { useAllTransactionCategories } from './useAllTransactionCategories';

export const useTransactionCategoryName = (): ((
  categoryId: string
) => string | undefined) => {
  const categories = useAllTransactionCategories();

  console.log('useTransactionCategoryName', categories);

  return useCallback(
    (categoryId) => categories.find(({ _id }) => _id === categoryId)?.name,
    [categories]
  );
};
