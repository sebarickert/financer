import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  getAllTransactionCategories,
  ITransactionCategoryWithCategoryTree,
  parseParentCategoryPath,
} from '../../services/TransactionCategoriesService';

export const useAllTransactionCategories = (): ITransactionCategory[] => {
  const transactionCategoriesQuery = useQuery(
    'transactionCategories',
    getAllTransactionCategories,
    {
      staleTime: 300000,
    }
  );

  return transactionCategoriesQuery.data || [];
};

export const useAllTransactionCategoriesWithCategoryTree = ():
  | ITransactionCategoryWithCategoryTree[] => {
  const transactionCategories = useAllTransactionCategories();

  const [categoryTree, setCategoryTree] = useState<
    ITransactionCategoryWithCategoryTree[]
  >([]);

  useEffect(() => {
    setCategoryTree(
      transactionCategories
        ?.map((transactionCategory) => ({
          ...transactionCategory,
          categoryTree: parseParentCategoryPath(
            transactionCategories,
            transactionCategory._id
          ),
        }))
        .sort((a, b) =>
          // eslint-disable-next-line no-nested-ternary
          a.categoryTree > b.categoryTree
            ? 1
            : b.categoryTree > a.categoryTree
            ? -1
            : 0
        ) || []
    );
  }, [transactionCategories]);

  return categoryTree;
};
