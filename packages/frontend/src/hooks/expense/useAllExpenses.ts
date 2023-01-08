import { ExpenseDto, PaginationDto } from '@local/types';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { getAllExpenses } from '../../services/ExpenseService';
import { TransactionFilterOptions } from '../../services/TransactionService';
import { useUserTransactionListChunkSize } from '../profile/user-preference/useUserTransactionListChunkSize';
import { PagerOptions, usePager } from '../usePager';

type UseAllExpensesPagedReturn = {
  data: PaginationDto<ExpenseDto<string>[]>;
  pagerOptions: PagerOptions;
};

export const useAllExpenses = (): ExpenseDto[] => {
  const { data, error } = useQuery(['expenses'], () => getAllExpenses());

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data.data;
};

export const useAllExpensesPaged = (
  intialPage = 1,
  requestParams: Omit<TransactionFilterOptions, 'page'> = {}
): UseAllExpensesPagedReturn => {
  const { data: chunkAmount } = useUserTransactionListChunkSize();
  const { page, getLoadPageFunctions, setPage } = usePager(intialPage);

  const { data, error } = useQuery(['expenses', page, requestParams], () =>
    getAllExpenses({ limit: chunkAmount, ...requestParams, page })
  );

  const stringifiedParams = JSON.stringify(requestParams);

  useEffect(() => {
    setPage(intialPage);
  }, [intialPage, setPage, stringifiedParams]);

  if (!data || error) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return {
    data: data,
    pagerOptions: getLoadPageFunctions(data),
  };
};
