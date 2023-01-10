import { PaginationDto, TransactionDto } from '@local/types';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  getAllTransactions,
  TransactionFilterOptions,
} from '../../services/TransactionService';
import { useUserTransactionListChunkSize } from '../profile/user-preference/useUserTransactionListChunkSize';
import { PagerOptions, usePager } from '../usePager';

type UseAllTransactionsPagedReturn = {
  data: PaginationDto<TransactionDto<string>[]>;
  pagerOptions: PagerOptions;
};

export const useAllTransactions = (): TransactionDto[] => {
  const { data, error } = useQuery(['transactions'], () =>
    getAllTransactions()
  );

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data.data;
};

export const useAllTransactionsPaged = (
  intialPage = 1,
  requestParams: Omit<TransactionFilterOptions, 'page'> = {}
): UseAllTransactionsPagedReturn => {
  const { data: chunkAmount } = useUserTransactionListChunkSize();
  const {
    page,
    getPagerOptions: getLoadPageFunctions,
    setPage,
  } = usePager(intialPage);

  const stringifiedParams = JSON.stringify(requestParams);

  useEffect(() => {
    setPage(intialPage);
  }, [intialPage, setPage, stringifiedParams]);

  const { data, error } = useQuery(['transactions', page, requestParams], () =>
    getAllTransactions({ limit: chunkAmount, ...requestParams, page })
  );

  if (!data || error) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return {
    data: data,
    pagerOptions: getLoadPageFunctions(data),
  };
};
