import { IncomeDto, PaginationDto } from '@local/types';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { getAllIncomes } from '../../services/IncomeService';
import { TransactionFilterOptions } from '../../services/TransactionService';
import { useUserTransactionListChunkSize } from '../profile/user-preference/useUserTransactionListChunkSize';
import { PagerOptions, usePager } from '../usePager';

type UseAllIncomesPagedReturn = {
  data: PaginationDto<IncomeDto<string>[]>;
  pagerOptions: PagerOptions;
};

export const useAllIncomes = (): IncomeDto[] => {
  const { data, error } = useQuery(['incomes'], () => getAllIncomes());

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data.data;
};

export const useAllIncomesPaged = (
  intialPage = 1,
  requestParams: Omit<TransactionFilterOptions, 'page'> = {}
): UseAllIncomesPagedReturn => {
  const { data: chunkAmount } = useUserTransactionListChunkSize();
  const { page, getLoadPageFunctions, setPage } = usePager(intialPage);

  const { data, error } = useQuery(['incomes', page, requestParams], () =>
    getAllIncomes({ limit: chunkAmount, ...requestParams, page })
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
