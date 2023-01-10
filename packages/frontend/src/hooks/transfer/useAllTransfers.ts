import { PaginationDto, TransferDto } from '@local/types';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import {
  sortIncomeStacksByMonth,
  sortIncomesByDate,
} from '../../pages/income/IncomeFuctions';
import {
  TransfersPerMonth,
  groupTransfersByMonth,
} from '../../pages/transfers/TransferFuctions';
import { TransactionFilterOptions } from '../../services/TransactionService';
import { getAllTransfers } from '../../services/TransferService';
import { useUserTransactionListChunkSize } from '../profile/user-preference/useUserTransactionListChunkSize';
import { useAllTransactionCategories } from '../transactionCategories/useAllTransactionCategories';
import { PagerOptions, usePager } from '../usePager';

type UseAllTransfersPagedReturn = {
  data: PaginationDto<TransferDto<string>[]>;
  pagerOptions: PagerOptions;
};

export const useAllTransfers = (): TransferDto[] => {
  const { data, error } = useQuery(['transfers'], () => getAllTransfers());

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data.data;
};

export const useAllTransfersPaged = (
  intialPage = 1,
  requestParams: Omit<TransactionFilterOptions, 'page'> = {}
): UseAllTransfersPagedReturn => {
  const { data: chunkAmount } = useUserTransactionListChunkSize();
  const { page, getPagerOptions, setPage } = usePager(intialPage);

  const { data, error } = useQuery(['transfers', page, requestParams], () =>
    getAllTransfers({ limit: chunkAmount, ...requestParams, page })
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
    pagerOptions: getPagerOptions(data),
  };
};

export const useAllTransfersGroupByMonth = () => {
  const transfers = useAllTransfers();
  const [groupedTransfers, setGroupedTransfers] = useState<TransfersPerMonth[]>(
    []
  );
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    if (transfers === null) return;

    setGroupedTransfers(
      transfers
        .map(({ _id, categories, ...rest }) => {
          const categoryMappings = categories
            .map(
              ({ category_id }) =>
                transactionCategories.find(
                  ({ _id: categoryId }) => category_id === categoryId
                )?.name
            )
            .filter(
              (categoryName) => typeof categoryName !== 'undefined'
              // @todo: Fix this type.
            ) as string[];

          return { _id, categories, ...rest, categoryMappings };
        })
        .reduce<TransfersPerMonth[]>(groupTransfersByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [transactionCategories, transfers]);

  return groupedTransfers;
};
