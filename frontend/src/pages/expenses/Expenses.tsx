import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button/button";
import Hero from "../../components/hero/hero";
import Table, { ITableHead } from "../../components/table/table";
import { TAddiotinalLabel } from "../../components/table/table.header";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";

const Expenses = (): JSX.Element => {
  const [expensesRaw, setExpensesRaw] = useState<IExpense[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(NaN);

  useEffect(() => {
    const fetchExpenses = async () => {
      const rawExpenses = await fetch("/api/expense");
      setExpensesRaw(await rawExpenses.json());
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const total = expensesRaw.reduce(
      (currentTotal, { amount }) => currentTotal + amount,
      0
    );
    setTotalAmount(total);
    setExpenses(
      expensesRaw.map(({ _id, amount, date, ...expense }) => ({
        ...expense,
        _id,
        amount: formatCurrency(amount),
        date: formatDate(date),
        actions: <Link to={`/expenses/${_id}`}>View</Link>,
      }))
    );
  }, [expensesRaw]);

  console.log(expensesRaw);
  console.log(expenses);

  const tableHeads: ITableHead[] = [
    { key: "description", label: "Description" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
    { key: "actions", label: "" },
  ];

  const addiotinalLabel: TAddiotinalLabel = {
    label: `${Number.isNaN(totalAmount) ? "-" : formatCurrency(totalAmount)}`,
    accentLabel: "Total",
  };

  return (
    <>
      <Hero accent="Your" accentColor="red" label="Expenses">
        Below you are able to review all your added expenses and see a summary
        of the current month.
      </Hero>
      <div className="mt-6">
        <Button link="/expenses/add" accentColor="red">
          Add expense
        </Button>
      </div>
      <div className="mt-12">
        <Table
          addiotinalLabel={addiotinalLabel}
          label="MONTH, YEAR"
          rows={expenses}
          tableHeads={tableHeads}
          dataKeyColumn="_id"
        />
      </div>
    </>
  );
};

export default Expenses;
