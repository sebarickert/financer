import { TransactionCategoryDto } from '@local/types';
import { useQuery } from 'react-query';

import {
  getAllTransactionCategories,
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
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

export const useAllTransactionCategoriesWithCategoryTree =
  (): ITransactionCategoryWithCategoryTree[] => {
    const { data, error } = useQuery(
      ['transactionCategories', 'transactionCategoriesTree'],
      getAllTransactionCategoriesWithCategoryTree
    );

    if (error || !data) {
      throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
    }

    return data;
  };
