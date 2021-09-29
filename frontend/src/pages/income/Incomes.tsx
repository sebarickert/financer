import React, { useState, useEffect } from "react";
import Banner from "../../components/banner/banner";
import BannerText from "../../components/banner/banner.text";
import Button from "../../components/button/button";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import TransactionStackedList from "../../components/transaction-stacked-list/transaction-stacked-list";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import {
  groupIncomesByMonth,
  IIncomesPerMonth,
  sortIncomesByDate,
  sortIncomeStacksByMonth,
} from "./IncomeFuctions";
import { getAllIncomes } from "./IncomeService";

const Incomes = (): JSX.Element => {
  const [incomesRaw, setIncomesRaw] = useState<IIncome[] | null>(null);
  const [incomes, setIncomes] = useState<IIncomesPerMonth[]>([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      setIncomesRaw(await getAllIncomes());
    };

    fetchIncomes();
  }, []);

  useEffect(() => {
    if (incomesRaw === null) return;

    setIncomes(
      incomesRaw
        .reduce<IIncomesPerMonth[]>(groupIncomesByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [incomesRaw]);

  return incomesRaw === null ? (
    <Loader loaderColor="green" />
  ) : (
    <>
      <SEO title="Incomes" />
      <Banner title="Incomes" headindType="h1" className="mb-8">
        <BannerText>Overview page for your income transactions.</BannerText>
        <Button
          link="/statistics/incomes/add"
          className="mt-6"
          accentColor="green"
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
              {Number.isNaN(total) ? "-" : formatCurrency(total)}
            </p>
          </div>
          <TransactionStackedList rows={rows} />
        </section>
      ))}
    </>
  );
};

export default Incomes;
