import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import StackedList from "../../components/stacked-list/stacked-list";
import { TAddiotinalLabel } from "../../components/table/table.header";
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

  const getAddiotinalLabel = (total: number): TAddiotinalLabel => ({
    label: `${Number.isNaN(total) ? "-" : formatCurrency(total)}`,
    accentLabel: "Total",
  });

  return incomesRaw === null ? (
    <Loader loaderColor="green" />
  ) : (
    <>
      <SEO title="Incomes" />
      <Hero accent="Overview" accentColor="green" label="Incomes">
        Below you are able to review all your added incomes and see a summary of
        the current month.
      </Hero>
      <div className="mt-12">
        <Button link="/incomes/add" accentColor="green">
          Add income
        </Button>
      </div>
      <div className="mt-12">
        {incomes.map(({ year, month, rows, total }) => (
          <div className="md:mt-6" key={`${year}-${month}`}>
            <StackedList
              addiotinalLabel={getAddiotinalLabel(total)}
              label={`${monthNames[month]}, ${year}`}
              rows={rows}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Incomes;
