import { useState, useEffect } from 'react';

import { ITransactionCategoryWithCategoryTree } from '../../services/TransactionCategoriesService';

import {
  useAllTransactionCategories,
  useAllTransactionCategoriesWithCategoryTree,
} from './useAllTransactionCategories';

export const useAllTransactionCategoriesForIncome =
  (): ITransactionCategory[] => {
    const [incomeCategories, setIncomeCategories] = useState<
      ITransactionCategory[]
    >([]);
    const allTransactionCategories = useAllTransactionCategories();

    useEffect(() => {
      setIncomeCategories(
        allTransactionCategories?.filter(({ visibility }) =>
          visibility.includes('income')
        ) || []
      );
    }, [allTransactionCategories]);

    return incomeCategories;
  };

export const useAllTransactionCategoriesForIncomeWithCategoryTree = ():
  | ITransactionCategoryWithCategoryTree[] => {
  const [incomeCategories, setIncomeCategories] = useState<
    ITransactionCategoryWithCategoryTree[]
  >([]);
  const transactionCategoriesWithTree =
    useAllTransactionCategoriesWithCategoryTree();

  useEffect(() => {
    setIncomeCategories(
      transactionCategoriesWithTree?.filter(({ visibility }) =>
        visibility.includes('income')
      ) || []
    );
  }, [transactionCategoriesWithTree]);

  return incomeCategories;
};
