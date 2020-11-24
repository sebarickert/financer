import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import SEO from "../../components/seo/seo";
import Table, { ITableHead } from "../../components/table/table";
import { TAddiotinalLabel } from "../../components/table/table.header";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

interface IExpenseOutput extends Omit<IExpense, "date" | "amount" | "_id"> {
  _id: string;
  actions: JSX.Element;
  date: string;
  amount: string;
}

export interface IExpensesPerMonth {
  month: number;
  total: number;
  year: number;
  rows: any[];
}

const Expenses = (): JSX.Element => {
  const [expensesRaw, setExpensesRaw] = useState<IExpense[] | null>(null);
  const [expenses, setExpenses] = useState<IExpensesPerMonth[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const rawExpenses = await fetch("/api/expense");
      setExpensesRaw(await rawExpenses.json());
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (expensesRaw === null) return;

    setExpenses(
      expensesRaw
        .reduce<IExpensesPerMonth[]>(
          (dateStack, { _id, amount, date: dateRaw, ...expenseRest }) => {
            const date = new Date(dateRaw);
            const month = date.getMonth();
            const year = date.getFullYear();

            const expense: IExpenseOutput = {
              ...expenseRest,
              _id,
              amount: formatCurrency(amount),
              date: formatDate(date),
              actions: <Link to={`/expenses/${_id}`}>View</Link>,
            };

            if (
              dateStack.some(
                ({ month: stackMonth, year: stackYear }) =>
                  month === stackMonth && year === stackYear
              )
            ) {
              return dateStack.map(
                ({
                  month: stackMonth,
                  year: stackYear,
                  total: stackTotal,
                  rows: stackRows,
                }) => ({
                  month: stackMonth,
                  year: stackYear,
                  total: stackTotal + amount,
                  rows:
                    stackYear === year && stackMonth === month
                      ? [...stackRows, expense]
                      : stackRows,
                })
              );
            }
            return dateStack.concat({
              year,
              month,
              total: amount,
              rows: [expense],
            });
          },
          []
        )
        .sort((a, b) => {
          if (a.year > b.year) {
            return -1;
          }

          if (b.year > a.year) {
            return 1;
          }

          if (a.month > b.month) {
            return -1;
          }

          if (b.month > a.month) {
            return 1;
          }

          return 0;
        })
        .map((stack) => {
          stack.rows.sort((a, b) => (a.date > b.date ? -1 : 1));
          return stack;
        })
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
            rows={rows}
            tableHeads={tableHeads}
            dataKeyColumn="_id"
          />
        </div>
      ))}
    </>
  );
};

export default Expenses;
