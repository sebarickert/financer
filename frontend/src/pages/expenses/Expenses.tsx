import React, { useState, useEffect } from "react";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import Table, { ITableHead } from "../../components/table/table";
import { TAddiotinalLabel } from "../../components/table/table.header";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
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

  const tableHeads: ITableHead[] = [
    { key: "description", label: "Description" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
    { key: "actions", label: "" },
  ];

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
      {expenses.map(({ year, month, rows, total }) => (
        <div className="mt-12" key={`${year}-${month}`}>
          <Table
            addiotinalLabel={getAddiotinalLabel(total)}
            label={`${monthNames[month]}, ${year}`}
            rows={rows.map(({ date, ...rest }) => ({
              ...rest,
              date: formatDate(date),
            }))}
            tableHeads={tableHeads}
            dataKeyColumn="_id"
          />
        </div>
      ))}
    </>
  );
};

export default Expenses;
