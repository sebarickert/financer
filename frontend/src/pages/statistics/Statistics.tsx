import { useEffect, useState } from 'react';

import { Dropdown } from '../../components/dropdown/dropdown';
import { Heading } from '../../components/heading/heading';
import { Loader } from '../../components/loader/loader';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { SEO } from '../../components/seo/seo';
import { StatsGroup } from '../../components/stats/stats.group';
import { StatsItem } from '../../components/stats/stats.item';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import {
  ITransactionStackedListRowProps,
  TransactionType,
} from '../../components/transaction-stacked-list/transaction-stacked-list.row';
import { monthNames } from '../../constants/months';
import { useAllTransactions } from '../../hooks/transaction/useAllTransactions';
import { useAllTransactionCategories } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../../hooks/transactionCategoryMapping/useAllTransactionCategoryMappings';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

type TransactionVisibilityFilterType =
  | 'all'
  | 'income'
  | 'expense'
  | 'transfer';

export const getTransactionType = (
  toAccount: string | null | undefined,
  fromAccount: string | null | undefined
): TransactionType => {
  if (toAccount && !fromAccount) {
    return 'income';
  }

  if (!toAccount && fromAccount) {
    return 'expense';
  }

  return 'transfer';
};

export const mapTransactionTypeToUrlPrefix: {
  [key in TransactionType]: 'incomes' | 'expenses' | 'transfers';
} = {
  income: 'incomes',
  expense: 'expenses',
  transfer: 'transfers',
};

export const filterTransactionsByType = (
  visibilityFilter: TransactionVisibilityFilterType,
  { toAccount, fromAccount }: ITransaction
) => {
  if (visibilityFilter === 'all') return true;

  return getTransactionType(toAccount, fromAccount) === visibilityFilter;
};

export const Statistics = (): JSX.Element => {
  const [transactionVisibilityFilter, setTransactionVisibilityFilter] =
    useState<TransactionVisibilityFilterType>('all');
  const transactionsRaw = useAllTransactions();
  const [transactions, setTransactions] = useState<ITransaction[] | null>(null);
  const [visibleTransactions, setVisibleTransactions] = useState<
    ITransactionStackedListRowProps[] | null
  >(null);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();
  const [totalExpenses, setTotalExpenses] = useState<number>(NaN);
  const [totalIncomes, setTotalIncomes] = useState<number>(NaN);

  useEffect(() => {
    if (transactions === null) return;

    setVisibleTransactions(
      transactions
        .filter((transaction) =>
          filterTransactionsByType(transactionVisibilityFilter, transaction)
        )
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
  }, [
    transactions,
    transactionVisibilityFilter,
    transactionCategoryMappings,
    transactionCategories,
  ]);

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

  return visibleTransactions === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Statistics" />
      <Heading variant="h1" className="mb-4 lg:mb-6">
        Statistics
      </Heading>
      <section className="mt-4">
        <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-0 z-10 bg-white-off py-4">
          <h2 className="text-2xl font-bold tracking-tighter truncate sm:text-3xl">
            {`${pageVisibleMonth}, ${pageVisibleYear}`}
          </h2>
          <Dropdown
            items={filterItems}
            label="Filter"
            className="mb-[-3px] sm:mb-[-1px]"
          />
        </div>
        <StatsGroup>
          <StatsItem statLabel="Incomes">
            {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
          </StatsItem>
          <StatsItem statLabel="Expenses">
            {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
          </StatsItem>
        </StatsGroup>
        <TransactionStackedList className="mt-4" rows={visibleTransactions} />
      </section>
      <QuickLinks className="mt-8">
        <QuickLinksItem
          title="Incomes"
          link="/statistics/incomes"
          iconName="download"
          iconBackgroundColor="green"
          description="Go to incomes page where you are able to manage your income transactions."
        />
        <QuickLinksItem
          title="Expenses"
          link="/statistics/expenses"
          iconName="upload"
          iconBackgroundColor="red"
          description="Go to expenses page where you are able to manage your expense transactions."
        />
        <QuickLinksItem
          title="Transfers"
          link="/statistics/transfers"
          iconName="switch-horizontal"
          description="Go to transfers page where you are able to manage your transfer transactions."
        />
      </QuickLinks>
    </>
  );
};
