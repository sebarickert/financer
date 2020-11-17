import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import Table, { ITableHead } from "../../components/table/table";
import { TAddiotinalLabel } from "../../components/table/table.header";
import monthNames from "../../constants/months";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

interface IIncomeOutput extends Omit<IExpense, "date" | "amount" | "_id"> {
  _id: string;
  actions: JSX.Element;
  date: string;
  amount: string;
}

interface IIncomesPerMonth {
  month: number;
  total: number;
  year: number;
  rows: any[];
}

const Incomes = (): JSX.Element => {
  const [incomesRaw, setIncomesRaw] = useState<IIncome[] | null>(null);
  const [incomes, setIncomes] = useState<IIncomesPerMonth[]>([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      const rawIncomes = await fetch("/api/income");
      setIncomesRaw(await rawIncomes.json());
    };
    fetchIncomes();
  }, []);

  useEffect(() => {
    if (incomesRaw === null) return;

    setIncomes(
      incomesRaw.reduce<IIncomesPerMonth[]>(
        (dateStack, { _id, amount, date: dateRaw, ...incomeRest }) => {
          const date = new Date(dateRaw);
          const month = date.getMonth();
          const year = date.getFullYear();

          const income: IIncomeOutput = {
            ...incomeRest,
            _id,
            amount: formatCurrency(amount),
            date: formatDate(date),
            actions: <Link to={`/incomes/${_id}`}>View</Link>,
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
                    ? [...stackRows, income]
                    : stackRows,
              })
            );
          }
          return dateStack.concat({
            year,
            month,
            total: amount,
            rows: [income],
          });
        },
        []
      )
    );
  }, [incomesRaw]);

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

  return incomesRaw === null ? (
    <Loader loaderColor="green" />
  ) : (
    <>
      <Hero accent="Your" accentColor="green" label="Incomes">
        Below you are able to review all your added incomes and see a summary of
        the current month.
      </Hero>
      <div className="mt-12">
        <Button link="/incomes/add" accentColor="green">
          Add income
        </Button>
      </div>
      {incomes.map(({ year, month, rows, total }) => (
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

export default Incomes;
