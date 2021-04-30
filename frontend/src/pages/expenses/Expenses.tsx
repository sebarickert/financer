import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import Container from "../../components/container/container";
import Hero from "../../components/hero/hero";
import HeroLead from "../../components/hero/hero.lead";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import StackedList from "../../components/stacked-list/stacked-list";
import { TAddiotinalLabel } from "../../components/table/table.header";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import {
  groupExpensesByMonth,
  IExpensesPerMonth,
  sortExpensesByDate,
  sortExpenseStacksByMonth,
} from "./ExpenseFuctions";
import { getAllExpenses } from "./ExpenseService";

const Expenses = (): JSX.Element => {
  const [expensesRaw, setExpensesRaw] = useState<IExpense[] | null>(null);
  const [expenses, setExpenses] = useState<IExpensesPerMonth[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpensesRaw(await getAllExpenses());
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    if (expensesRaw === null) return;

    setExpenses(
      expensesRaw
        .reduce<IExpensesPerMonth[]>(groupExpensesByMonth, [])
        .sort(sortExpenseStacksByMonth)
        .map(sortExpensesByDate)
    );
  }, [expensesRaw]);

  const getAddiotinalLabel = (total: number): TAddiotinalLabel => ({
    label: `${Number.isNaN(total) ? "-" : formatCurrency(total)}`,
    accentLabel: "Total",
  });

  return expensesRaw === null ? (
    <Loader loaderColor="red" />
  ) : (
    <>
      <SEO title="Expenses" />
      <Hero accent="Overview" accentColor="red" label="Expenses">
        <HeroLead>
          Below you are able to review all your added expenses and see a summary
          of the current month.
        </HeroLead>
        <Button className="mt-12" link="/expenses/add" accentColor="red">
          Add expense
        </Button>
      </Hero>
      <Container className="lg:mt-12">
        {expenses.map(({ year, month, rows, total }) => (
          <div className="lg:mt-6" key={`${year}-${month}`}>
            <StackedList
              addiotinalLabel={getAddiotinalLabel(total)}
              label={`${monthNames[month]}, ${year}`}
              rows={rows}
            />
          </div>
        ))}
      </Container>
    </>
  );
};

export default Expenses;
