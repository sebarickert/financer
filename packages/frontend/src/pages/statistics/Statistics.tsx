import { TransactionDto } from '@local/types';
import { useEffect, useState, useTransition } from 'react';

import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { IconName } from '../../components/icon/icon';
import {
  getTransactionType,
  LatestTransactions,
} from '../../components/latest-transactions/latest-transactions';
import { LoaderIfProcessing } from '../../components/loader/loader-if-processing';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { monthNames } from '../../constants/months';
import { useAllExpensesPaged } from '../../hooks/expense/useAllExpenses';
import { useAllIncomesPaged } from '../../hooks/income/useAllIncomes';
import {
  useAllTransactions,
  useAllTransactionsPaged,
} from '../../hooks/transaction/useAllTransactions';
import { useAllTransfersPaged } from '../../hooks/transfer/useAllTransfers';
import { formatCurrency } from '../../utils/formatCurrency';

type TransactionVisibilityFilterType =
  | 'all'
  | 'income'
  | 'expense'
  | 'transfer';

export const filterTransactionsByType = (
  visibilityFilter: TransactionVisibilityFilterType,
  { toAccount, fromAccount }: TransactionDto
) => {
  if (visibilityFilter === 'all') return true;

  return getTransactionType(toAccount, fromAccount) === visibilityFilter;
};

export const Statistics = (): JSX.Element => {
  const [isProcessing, startProcessing] = useTransition();
  const [transactionVisibilityFilter, setTransactionVisibilityFilter] =
    useState<TransactionVisibilityFilterType>('all');
  const transactionsRaw = useAllTransactions();
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(NaN);
  const [totalIncomes, setTotalIncomes] = useState<number>(NaN);

  useEffect(() => {
    startProcessing(() => {
      setTotalIncomes(
        transactions
          .filter((transaction) =>
            filterTransactionsByType('income', transaction)
          )
          .reduce((currentTotal, { amount }) => currentTotal + amount, 0)
      );

      setTotalExpenses(
        transactions
          .filter((transaction) =>
            filterTransactionsByType('expense', transaction)
          )
          .reduce((currentTotal, { amount }) => currentTotal + amount, 0)
      );
    });
  }, [transactions]);

  useEffect(() => {
    const now = new Date();

    setTransactions(
      transactionsRaw.filter(({ date: dateStr }) => {
        const date = new Date(dateStr);
        const currentYear = new Date().getFullYear();

        return (
          date.getMonth() === now.getMonth() &&
          currentYear === date.getFullYear()
        );
      })
    );
  }, [transactionsRaw]);

  const now = new Date();
  const pageVisibleYear = now.getFullYear();
  const pageVisibleMonth = monthNames[now.getMonth()];

  const filterItems = [
    {
      label: 'All',
      onClick: () => setTransactionVisibilityFilter('all'),
    },
    {
      label: 'Income',
      onClick: () => setTransactionVisibilityFilter('income'),
    },
    {
      label: 'Expense',
      onClick: () => setTransactionVisibilityFilter('expense'),
    },
    {
      label: 'Transfer',
      onClick: () => setTransactionVisibilityFilter('transfer'),
    },
  ];

  const getCorrectHook = () => {
    if (transactionVisibilityFilter === 'income') {
      return useAllIncomesPaged;
    } else if (transactionVisibilityFilter === 'expense') {
      return useAllExpensesPaged;
    } else if (transactionVisibilityFilter === 'transfer') {
      return useAllTransfersPaged;
    }

    return useAllTransactionsPaged;
  };

  return (
    <LoaderIfProcessing isProcessing={isProcessing}>
      <UpdatePageInfo title="Statistics" />
      <DescriptionList
        label={`${pageVisibleMonth}, ${pageVisibleYear}`}
        filterOptions={filterItems}
      >
        <DescriptionListItem label="Incomes">
          {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
        </DescriptionListItem>
        <DescriptionListItem label="Expenses">
          {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
        </DescriptionListItem>
      </DescriptionList>
      <LatestTransactions className="mt-4" useDataHook={getCorrectHook()} />
      <QuickLinks className="mt-8">
        <QuickLinksItem
          title="Incomes"
          link="/statistics/incomes"
          iconName={IconName.download}
          iconBackgroundColor="green"
          description="Go to incomes page where you are able to manage your income transactions."
        />
        <QuickLinksItem
          title="Expenses"
          link="/statistics/expenses"
          iconName={IconName.upload}
          iconBackgroundColor="red"
          description="Go to expenses page where you are able to manage your expense transactions."
        />
        <QuickLinksItem
          title="Transfers"
          link="/statistics/transfers"
          iconName={IconName.switchHorizontal}
          description="Go to transfers page where you are able to manage your transfer transactions."
        />
      </QuickLinks>
    </LoaderIfProcessing>
  );
};
