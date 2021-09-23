import React, { useEffect, useState } from "react";
import Banner from "../../components/banner/banner";
import Divider from "../../components/divider/divider";
import Filter from "../../components/filter/filter";
import FilterItem from "../../components/filter/filter.item";
import Loader from "../../components/loader/loader";
import QuickLinks from "../../components/quick-links/quick-links";
import QuickLinksItem from "../../components/quick-links/quick-links.item";
import SEO from "../../components/seo/seo";
import Stats from "../../components/stats/stats";
import StatsItem from "../../components/stats/stats.item";
import TransactionStackedList from "../../components/transaction-stacked-list/transaction-stacked-list";
import {
  ITransactionStackedListRowProps,
  TransactionType,
} from "../../components/transaction-stacked-list/transaction-stacked-list.row";
import monthNames from "../../constants/months";
import { getAllUserTransactions } from "../../services/TransactionService";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getAllTransactionCategories } from "../profile/TransactionCategories/TransactionCategoriesService";

type TransactionVisibilityFilterType =
  | "all"
  | "income"
  | "expense"
  | "transfer";

const getAllUserTransactionCategoryMappings = async (): Promise<
  ITransactionCategoryMapping[]
> => (await fetch("/api/transaction-categories-mapping")).json();

const getTransactionType = (
  toAccount: string | null | undefined,
  fromAccount: string | null | undefined
): TransactionType => {
  if (toAccount && !fromAccount) {
    return "income";
  }

  if (!toAccount && fromAccount) {
    return "expense";
  }

  return "transfer";
};

const mapTransactionTypeToUrlPrefix: {
  [key in TransactionType]: "incomes" | "expenses" | "transfers";
} = {
  income: "incomes",
  expense: "expenses",
  transfer: "transfers",
};

const filterTransactionsByType = (
  visibilityFilter: TransactionVisibilityFilterType,
  { toAccount, fromAccount }: ITransaction
) => {
  if (visibilityFilter === "all") return true;

  return getTransactionType(toAccount, fromAccount) === visibilityFilter;
};

const Statistics = (): JSX.Element => {
  const [transactionVisibilityFilter, setTransactionVisibilityFilter] =
    useState<TransactionVisibilityFilterType>("all");
  const [transactionsRaw, setTransactionsRaw] = useState<ITransaction[] | null>(
    null
  );
  const [transactions, setTransactions] = useState<ITransaction[] | null>(null);
  const [visibleTransactions, setVisibleTransactions] = useState<
    ITransactionStackedListRowProps[] | null
  >(null);
  const [transactionCategoryMappings, setTransactionCategoryMappings] =
    useState<ITransactionCategoryMapping[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(NaN);
  const [totalExpenses, setTotalExpenses] = useState<number>(NaN);
  const [totalIncomes, setTotalIncomes] = useState<number>(NaN);

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
    if (transactions === null) return;

    setTotalTransactions(transactions.length);
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
              .filter((categoryName) => typeof categoryName !== "undefined");

            return {
              transactionCategories: categoryMappings.join(", "),
              transactionAmount: formatCurrency(amount),
              date: formatDate(date),
              label: description,
              link: `/${mapTransactionTypeToUrlPrefix[transactionType]}/${_id}`,
              transactionType,
              id: _id,
            } as ITransactionStackedListRowProps;
          }
        )
    );

    setTotalIncomes(
      transactions
        .filter((transaction) =>
          filterTransactionsByType("income", transaction)
        )
        .reduce((currentTotal, { amount }) => currentTotal + amount, 0)
    );

    setTotalExpenses(
      transactions
        .filter((transaction) =>
          filterTransactionsByType("expense", transaction)
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
          return date.getMonth() === now.getMonth();
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
      label: "All",
      onClick: () => setTransactionVisibilityFilter("all"),
    },
    {
      label: "Income",
      onClick: () => setTransactionVisibilityFilter("income"),
    },
    {
      label: "Expense",
      onClick: () => setTransactionVisibilityFilter("expense"),
    },
    {
      label: "Transfer",
      onClick: () => setTransactionVisibilityFilter("transfer"),
    },
  ];

  return visibleTransactions === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Statistics" />
      <Banner title="Statistics" headindType="h1">
        Manage all your transactions in one place - review, edit or delete.
      </Banner>
      <Filter filters={filterItems} />
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mt-8 mb-4">
        {`${pageVisibleMonth}, ${pageVisibleYear}`}
      </h2>
      <Stats>
        <StatsItem statLabel="Total Transactions">
          {`${totalTransactions}`}
        </StatsItem>
        <StatsItem statLabel="Total Incomes">
          {Number.isNaN(totalIncomes) ? "-" : formatCurrency(totalIncomes)}
        </StatsItem>
        <StatsItem statLabel="Total Expenses">
          {Number.isNaN(totalExpenses) ? "-" : formatCurrency(totalExpenses)}
        </StatsItem>
      </Stats>
      <TransactionStackedList className="mt-4" rows={visibleTransactions} />
      <Divider className="my-8">Continue to dedicated pages</Divider>
      <QuickLinks className="mt-4">
        <QuickLinksItem
          title="Incomes"
          link="/incomes"
          iconName="download"
          iconBackgroundColor="green"
          description="Go to incomes page where you are able to manage your income transactions."
        />
        <QuickLinksItem
          title="Expenses"
          link="/expenses"
          iconName="upload"
          iconBackgroundColor="red"
          description="Go to expenses page where you are able to manage your expense transactions."
        />
      </QuickLinks>
    </>
  );
};

export default Statistics;
