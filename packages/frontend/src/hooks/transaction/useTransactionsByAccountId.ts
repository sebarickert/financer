import { PaginationDto, TransactionDto } from '@local/types';
import { useQuery } from 'react-query';

import {
  getTransactionsByAccountId,
  TransactionFilterOptions,
} from '../../services/TransactionService';
import { useUserTransactionListChunkSize } from '../profile/user-preference/useUserTransactionListChunkSize';
import { PagerOptions, usePager } from '../usePager';

type UseAllTransactionsPagedReturn = {
  data: PaginationDto<TransactionDto<string>[]>;
  pagerOptions: PagerOptions;
};

export const useTransactionsByAccountId = (
  accountId: string
): TransactionDto[] | null => {
  const { data, error } = useQuery(['transactions', accountId], () =>
    getTransactionsByAccountId(accountId)
  );
  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data.data;
};

export const useTransactionsByAccountIdPaged = (
  accountId: string,
  intialPage = 1,
  requestParams: Omit<TransactionFilterOptions, 'page'> = {}
): UseAllTransactionsPagedReturn => {
  const { data: chunkAmount } = useUserTransactionListChunkSize();
  const { page, getPagerOptions } = usePager(intialPage);

  const { data, error } = useQuery(
    ['transactions', accountId, page, requestParams],
    () =>
      getTransactionsByAccountId(accountId, {
        limit: chunkAmount,
        ...requestParams,
        page,
      })
  );

  if (!data || error) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return {
    data: data,
    pagerOptions: getPagerOptions(data),
  };
};
