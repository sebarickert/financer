import React, { useState, useEffect } from 'react';

import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { Button } from '../../components/button/button';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { formatCurrency } from '../../utils/formatCurrency';
import { getAllUserTransactionCategoryMappings } from '../expenses/Expenses';
import { getAllTransactionCategories } from '../profile/TransactionCategories/TransactionCategoriesService';

import {
  groupIncomesByMonth,
  IIncomesPerMonth,
  sortIncomesByDate,
  sortIncomeStacksByMonth,
} from './IncomeFuctions';
import { getAllIncomes } from './IncomeService';

export const Incomes = (): JSX.Element => {
  const [incomesRaw, setIncomesRaw] = useState<IIncome[] | null>(null);
  const [incomes, setIncomes] = useState<IIncomesPerMonth[]>([]);
  const [transactionCategoryMappings, setTransactionCategoryMappings] =
    useState<ITransactionCategoryMapping[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      setIncomesRaw(await getAllIncomes());
    };

    const fetchAllTransactionCategories = async () => {
      setTransactionCategories(await getAllTransactionCategories());
    };
    const fetchAllUserTransactionCategoryMappings = async () => {
      setTransactionCategoryMappings(
        await getAllUserTransactionCategoryMappings()
      );
    };

    fetchIncomes();
    fetchAllTransactionCategories();
    fetchAllUserTransactionCategoryMappings();
  }, []);

  useEffect(() => {
    if (incomesRaw === null) return;

    setIncomes(
      incomesRaw
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
        .reduce<IIncomesPerMonth[]>(groupIncomesByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [incomesRaw, transactionCategories, transactionCategoryMappings]);

  return incomesRaw === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Incomes" />
      <Banner title="Incomes" headindType="h1" className="mb-8">
        <BannerText>Overview page for your income transactions.</BannerText>
        <Button
          link="/statistics/incomes/add"
          className="mt-6"
          accentColor="green"
          testId="add-income"
        >
          Add income
        </Button>
      </Banner>
      {incomes.map(({ year, month, rows, total }) => (
        <section
          className="mb-12"
          aria-label={`IOverview of income transactions for ${monthNames[month]}, ${year}`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-0 z-10 bg-white-off py-4 -mt-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter truncate">
              {`${monthNames[month]}, ${year}`}
            </h2>
            <p className="font-semibold text-gray-600">
              <span className="sr-only">Total: </span>
              {Number.isNaN(total) ? '-' : formatCurrency(total)}
            </p>
          </div>
          <TransactionStackedList rows={rows} />
        </section>
      ))}
    </>
  );
};
