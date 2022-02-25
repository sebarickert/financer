import React, { useEffect, useState } from 'react';

import { useAllTransactionCategories } from '../../hooks/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../../hooks/useAllTransactionCategoryMappings';
import { useAllTransactions } from '../../hooks/useAllTransactions';
import {
  getTransactionType,
  mapTransactionTypeToUrlPrefix,
} from '../../pages/statistics/Statistics';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Loader } from '../loader/loader';
import { TransactionStackedList } from '../transaction-stacked-list/transaction-stacked-list';
import { ITransactionStackedListRowProps } from '../transaction-stacked-list/transaction-stacked-list.row';

interface IDashboardLatestTransactionsProps {
  className?: string;
}

export const DashboardLatestTransactions = ({
  className = '',
}: IDashboardLatestTransactionsProps): JSX.Element => {
  const [visibleTransactions, setVisibleTransactions] = useState<
    ITransactionStackedListRowProps[] | null
  >(null);
  const transactionsRaw = useAllTransactions();
  const [transactions, setTransactions] = useState<ITransaction[] | null>(null);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    if (transactionsRaw === null) return;

    setTransactions(
      transactionsRaw
        .sort(({ date: dateA }, { date: dateB }) => {
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, 5)
    );
  }, [transactionsRaw]);

  useEffect(() => {
    if (transactions === null) return;

    setVisibleTransactions(
      transactions.map<ITransactionStackedListRowProps>(
        ({
          amount,
          _id,
          description,
          date: dateRaw,
          toAccount,
          fromAccount,
        }) => {
          const date = new Date(dateRaw);
          const transactionType = getTransactionType(toAccount, fromAccount);

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
  }, [transactions, transactionCategoryMappings, transactionCategories]);

  return visibleTransactions === null ? (
    <section className={`bg-white border rounded-lg py-1 ${className}`}>
      <Loader loaderColor="blue" />
    </section>
  ) : (
    <TransactionStackedList rows={visibleTransactions} />
  );
};
