import { useCallback } from 'react';

import { useTransactionCategoriesFindAllByUserQuery } from '$api/generated/financerApi';

export const useGetTransactionCategoryNameById = (): ((
  categoryId: string
) => string | undefined) => {
  const { data: categories } = useTransactionCategoriesFindAllByUserQuery({});

  return useCallback(
    (categoryId) => categories?.find(({ _id }) => _id === categoryId)?.name,
    [categories]
  );
};
