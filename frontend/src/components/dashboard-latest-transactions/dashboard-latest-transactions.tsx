import React, { useEffect, useState } from 'react';

import { getAllUserTransactionCategoryMappings } from '../../pages/expenses/Expenses';
import { getAllTransactionCategories } from '../../pages/profile/TransactionCategories/TransactionCategoriesService';
import {
  getTransactionType,
  mapTransactionTypeToUrlPrefix,
} from '../../pages/statistics/Statistics';
import { getAllUserTransactions } from '../../services/TransactionService';
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
  const [transactionsRaw, setTransactionsRaw] = useState<ITransaction[] | null>(
    null
  );
  const [transactions, setTransactions] = useState<ITransaction[] | null>(null);
  const [transactionCategoryMappings, setTransactionCategoryMappings] =
    useState<ITransactionCategoryMapping[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);

  useEffect(() => {
    const fetchAllUserTransactions = async () => {
      setTransactionsRaw((await getAllUserTransactions()).payload);
    };
    const fetchAllTransactionCategories = async () => {
      setTransactionCategories(await getAllTransactionCategories());
    };
    const fetchAllUserTransactionCategoryMappings = async () => {
      setTransactionCategoryMappings(
        await getAllUserTransactionCategoryMappings()
      );
    };
    fetchAllUserTransactions();
    fetchAllTransactionCategories();
    fetchAllUserTransactionCategoryMappings();
  }, []);

  useEffect(() => {
    if (transactionsRaw === null) return;

    const now = new Date();

    setTransactions(
      transactionsRaw
        .filter(({ date: dateStr }) => {
          const date = new Date(dateStr);
          const currentYear = new Date().getFullYear();

          return (
            date.getMonth() === now.getMonth() &&
            currentYear === date.getFullYear()
          );
        })
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
