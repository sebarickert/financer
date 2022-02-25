import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import {
  sortIncomeStacksByMonth,
  sortIncomesByDate,
} from '../pages/income/IncomeFuctions';
import {
  ITransfersPerMonth,
  groupTransfersByMonth,
} from '../pages/transfers/TransferFuctions';
import { getAllTransferTranscations } from '../pages/transfers/TransferService';

import { useAllTransactionCategories } from './useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from './useAllTransactionCategoryMappings';

export const useAllTransfers = (): ITransaction[] | null => {
  const transfersQuery = useQuery('transfers', getAllTransferTranscations, {
    staleTime: 300000,
  });

  return transfersQuery.data?.payload || null;
};

export const useAllTransfersGroupByMonth = () => {
  const transfers = useAllTransfers();
  const [groupedTransfers, setGroupedTransfers] = useState<
    ITransfersPerMonth[]
  >([]);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    if (transfers === null) return;

    setGroupedTransfers(
      transfers
        .map(({ _id, ...rest }) => {
          const categoryMappings = transactionCategoryMappings
            ?.filter(({ transaction_id }) => transaction_id === _id)
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

          return { _id, ...rest, categoryMappings };
        })
        .reduce<ITransfersPerMonth[]>(groupTransfersByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [transactionCategoryMappings, transactionCategories, transfers]);

  return groupedTransfers;
};
