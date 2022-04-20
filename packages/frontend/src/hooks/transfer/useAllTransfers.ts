import { TransferDto } from '@local/types';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import {
  sortIncomeStacksByMonth,
  sortIncomesByDate,
} from '../../pages/income/IncomeFuctions';
import {
  ITransfersPerMonth,
  groupTransfersByMonth,
} from '../../pages/transfers/TransferFuctions';
import { getAllTransfers } from '../../services/TransferService';
import { useAllTransactionCategories } from '../transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../transactionCategoryMapping/useAllTransactionCategoryMappings';

export const useAllTransfers = (): TransferDto[] => {
  const { data, error } = useQuery(['transfers'], getAllTransfers);

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data;
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
