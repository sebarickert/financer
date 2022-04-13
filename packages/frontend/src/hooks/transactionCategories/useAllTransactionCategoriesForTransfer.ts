import { TransactionCategoryDto, VisibilityType } from '@local/types';
import { useState, useEffect } from 'react';

import { ITransactionCategoryWithCategoryTree } from '../../services/TransactionCategoriesService';

import {
  useAllTransactionCategories,
  useAllTransactionCategoriesWithCategoryTree,
} from './useAllTransactionCategories';

export const useAllTransactionCategoriesForTransfer =
  (): TransactionCategoryDto[] => {
    const [incomeCategories, setIncomeCategories] = useState<
      TransactionCategoryDto[]
    >([]);
    const allTransactionCategories = useAllTransactionCategories();

    useEffect(() => {
      setIncomeCategories(
        allTransactionCategories?.filter(({ visibility }) =>
          visibility.includes(VisibilityType.transfer)
        ) || []
      );
    }, [allTransactionCategories]);

    return incomeCategories;
  };

export const useAllTransactionCategoriesForTransferWithCategoryTree = ():
  | ITransactionCategoryWithCategoryTree[] => {
  const [incomeCategories, setIncomeCategories] = useState<
    ITransactionCategoryWithCategoryTree[]
  >([]);
  const transactionCategoriesWithTree =
    useAllTransactionCategoriesWithCategoryTree();

  useEffect(() => {
    setIncomeCategories(
      transactionCategoriesWithTree?.filter(({ visibility }) =>
        visibility.includes(VisibilityType.transfer)
      ) || []
    );
  }, [transactionCategoriesWithTree]);

  return incomeCategories;
};
