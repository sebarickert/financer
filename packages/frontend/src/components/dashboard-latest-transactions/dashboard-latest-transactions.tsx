import { useEffect, useState, useTransition } from 'react';

import { useAllTransactions } from '../../hooks/transaction/useAllTransactions';
import { useAllTransactionCategories } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../../hooks/transactionCategoryMapping/useAllTransactionCategoryMappings';
import {
  getTransactionType,
  mapTransactionTypeToUrlPrefix,
} from '../../pages/statistics/Statistics';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { LoaderIfProcessing } from '../loader/loader-if-processing';
import { TransactionStackedList } from '../transaction-stacked-list/transaction-stacked-list';
import { ITransactionStackedListRowProps } from '../transaction-stacked-list/transaction-stacked-list.row';

interface IDashboardLatestTransactionsProps {
  className?: string;
}

export const DashboardLatestTransactions = ({
  className = '',
}: IDashboardLatestTransactionsProps): JSX.Element => {
  const [isProcessing, startProcessing] = useTransition();
  const [visibleTransactions, setVisibleTransactions] = useState<
    ITransactionStackedListRowProps[]
  >([]);
  const transactions = useAllTransactions();
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    startProcessing(() => {
      setVisibleTransactions(
        transactions
          .slice(0, 5)
          .map<ITransactionStackedListRowProps>(
            ({
              amount,
              _id,
              description,
              date: dateRaw,
              toAccount,
              fromAccount,
            }) => {
              const date = new Date(dateRaw);
              const transactionType = getTransactionType(
                toAccount,
                fromAccount
              );

              const categoryMappings = transactionCategoryMappings
                ?.filter(({ transaction_id }) => transaction_id === _id)
                .map(
                  ({ category_id }) =>
                    transactionCategories.find(
                      ({ _id: categoryId }) => category_id === categoryId
                    )?.name
                )
                .filter((categoryName) => typeof categoryName !== 'undefined');

              return {
                transactionCategories: categoryMappings.join(', '),
                transactionAmount: formatCurrency(amount),
                date: formatDate(date),
                label: description,
                link: `/statistics/${mapTransactionTypeToUrlPrefix[transactionType]}/${_id}`,
                transactionType,
                id: _id,
              } as ITransactionStackedListRowProps;
            }
          )
      );
    });
  }, [transactions, transactionCategoryMappings, transactionCategories]);

  return (
    <LoaderIfProcessing isProcessing={isProcessing}>
      <TransactionStackedList
        className={`${className}`}
        rows={visibleTransactions}
      />
    </LoaderIfProcessing>
  );
};
