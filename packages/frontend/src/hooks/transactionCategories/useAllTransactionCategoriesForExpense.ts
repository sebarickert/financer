import { useState, useEffect } from 'react';

import { ITransactionCategoryWithCategoryTree } from '../../services/TransactionCategoriesService';

import {
  useAllTransactionCategories,
  useAllTransactionCategoriesWithCategoryTree,
} from './useAllTransactionCategories';

export const useAllTransactionCategoriesForExpense =
  (): ITransactionCategory[] => {
    const [incomeCategories, setIncomeCategories] = useState<
      ITransactionCategory[]
    >([]);
    const allTransactionCategories = useAllTransactionCategories();

    useEffect(() => {
      setIncomeCategories(
        allTransactionCategories?.filter(({ visibility }) =>
          visibility.includes('expense')
        ) || []
      );
    }, [allTransactionCategories]);

    return incomeCategories;
  };

export const useAllTransactionCategoriesForExpenseWithCategoryTree = ():
  | ITransactionCategoryWithCategoryTree[] => {
  const [incomeCategories, setIncomeCategories] = useState<
    ITransactionCategoryWithCategoryTree[]
  >([]);
  const transactionCategoriesWithTree =
    useAllTransactionCategoriesWithCategoryTree();

  useEffect(() => {
    setIncomeCategories(
      transactionCategoriesWithTree?.filter(({ visibility }) =>
        visibility.includes('expense')
      ) || []
    );
  }, [transactionCategoriesWithTree]);

  return incomeCategories;
};
