import { TransactionCategoryDto } from '@local/types';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  getAllTransactionCategories,
  ITransactionCategoryWithCategoryTree,
  parseParentCategoryPath,
} from '../../services/TransactionCategoriesService';

export const useAllTransactionCategories = (): TransactionCategoryDto[] => {
  const { data, error } = useQuery(
    ['transactionCategories'],
    getAllTransactionCategories
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
};

export const useAllTransactionCategoriesWithCategoryTree = (
  initialForbiddenId?: string
): ITransactionCategoryWithCategoryTree[] => {
  const transactionCategories = useAllTransactionCategories();

  const [categoryTree, setCategoryTree] = useState<
    ITransactionCategoryWithCategoryTree[]
  >([]);
  const [forbiddenId, setForbiddenId] = useState(initialForbiddenId);

  useEffect(() => {
    setForbiddenId(initialForbiddenId);
  }, [initialForbiddenId]);

  useEffect(() => {
    const parseForbiddenIdFromHierarcy = (
      parentId: string,
      depth = 0
    ): string[] => {
      if (depth > 10) {
        return [];
      }

      const ids = transactionCategories
        .filter((category) => category.parent_category_id === parentId)
        .map<string>((category) => category._id);

      const childIds = ids
        .map((id) => parseForbiddenIdFromHierarcy(id, depth + 1))
        .flat(1);

      return [...ids, ...childIds];
    };

    const idsToExclude = forbiddenId
      ? parseForbiddenIdFromHierarcy(forbiddenId).concat(forbiddenId)
      : [];

    setCategoryTree(
      transactionCategories
        .filter((category) => !idsToExclude.includes(category._id))
        .map((transactionCategory) => ({
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
  }, [transactionCategories, forbiddenId]);

  return categoryTree;
};
