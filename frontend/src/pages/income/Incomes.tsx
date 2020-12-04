import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import StackedList from "../../components/stacked-list/stacked-list";
import { TAddiotinalLabel } from "../../components/table/table.header";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import { getAllAccounts } from "../accounts/AccountService";
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
  const [accounts, setAccounts] = useState<IAccount[] | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      setIncomesRaw(await getAllIncomes());
    };

    const fetchAccounts = async () => {
      setAccounts(await getAllAccounts());
    };

    fetchAccounts();
    fetchIncomes();
  }, []);

  useEffect(() => {
    if (incomesRaw === null || accounts === null) return;

    setIncomes(
      incomesRaw
        .reduce<IIncomesPerMonth[]>(groupIncomesByMonth(accounts), [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [incomesRaw, accounts]);

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
      <div className="mt-12" />
      {incomes.map(({ year, month, rows, total }) => (
        <div className="mt-6" key={`${year}-${month}`}>
          <StackedList
            addiotinalLabel={getAddiotinalLabel(total)}
            label={`${monthNames[month]}, ${year}`}
            rows={rows}
          />
        </div>
      ))}
    </>
  );
};

export default Incomes;
