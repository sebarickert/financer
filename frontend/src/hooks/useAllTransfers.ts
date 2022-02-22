import { useEffect, useState } from 'react';

import { getAllUserTransactionCategoryMappings } from '../pages/expenses/Expenses';
import {
  sortIncomeStacksByMonth,
  sortIncomesByDate,
} from '../pages/income/IncomeFuctions';
import { getAllTransactionCategories } from '../pages/profile/TransactionCategories/TransactionCategoriesService';
import {
  ITransfersPerMonth,
  groupTransfersByMonth,
} from '../pages/transfers/TransferFuctions';
import { getAllTransferTranscations } from '../pages/transfers/TransferService';

export const useAllTransfers = (): ITransaction[] | null => {
  const [transfers, setTransfers] = useState<ITransaction[] | null>(null);

  useEffect(() => {
    const fetchTransfers = async () => {
      setTransfers((await getAllTransferTranscations()).payload);
    };

    fetchTransfers();
  }, []);

  return transfers;
};

export const useAllTransfersGroupByMonth = () => {
  const transfers = useAllTransfers();
  const [groupedTransfers, setGroupedTransfers] = useState<
    ITransfersPerMonth[]
  >([]);
  const [transactionCategoryMappings, setTransactionCategoryMappings] =
    useState<ITransactionCategoryMapping[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);

  useEffect(() => {
    const fetchAllTransactionCategories = async () => {
      setTransactionCategories(await getAllTransactionCategories());
    };
    const fetchAllUserTransactionCategoryMappings = async () => {
      setTransactionCategoryMappings(
        await getAllUserTransactionCategoryMappings()
      );
    };

    fetchAllTransactionCategories();
    fetchAllUserTransactionCategoryMappings();
  }, []);

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
