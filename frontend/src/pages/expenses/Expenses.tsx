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
  groupExpensesByMonth,
  IExpensesPerMonth,
  sortExpensesByDate,
  sortExpenseStacksByMonth,
} from "./ExpenseFuctions";
import { getAllExpenses } from "./ExpenseService";

const Expenses = (): JSX.Element => {
  const [expensesRaw, setExpensesRaw] = useState<IExpense[] | null>(null);
  const [expenses, setExpenses] = useState<IExpensesPerMonth[]>([]);
  const [accounts, setAccounts] = useState<IAccount[] | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpensesRaw(await getAllExpenses());
    };

    const fetchAccounts = async () => {
      setAccounts(await getAllAccounts());
    };

    fetchAccounts();
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (expensesRaw === null || accounts === null) return;

    setExpenses(
      expensesRaw
        .reduce<IExpensesPerMonth[]>(groupExpensesByMonth(accounts), [])
        .sort(sortExpenseStacksByMonth)
        .map(sortExpensesByDate)
    );
  }, [expensesRaw, accounts]);

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
        Below you are able to review all your added expenses and see a summary
        of the current month.
      </Hero>
      <div className="mt-12">
        <Button link="/expenses/add" accentColor="red">
          Add expense
        </Button>
      </div>
      <div className="mt-12">
        {expenses.map(({ year, month, rows, total }) => (
          <div className="mt-6" key={`${year}-${month}`}>
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

export default Expenses;
