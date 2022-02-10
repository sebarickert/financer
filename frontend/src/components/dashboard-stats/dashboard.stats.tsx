import React, { useEffect, useState } from 'react';

import { getAllAccounts } from '../../pages/accounts/AccountService';
import { getAllExpenses } from '../../pages/expenses/ExpenseService';
import { getAllIncomes } from '../../pages/income/IncomeService';
import { formatCurrency } from '../../utils/formatCurrency';

interface IDashboardStatsProps {
  className?: string;
}

export const DashboardStats = ({
  className = '',
}: IDashboardStatsProps): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [totalBalance, setTotalBalance] = useState<number>(NaN);
  const [expensesRaw, setExpensesRaw] = useState<IExpense[] | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number>(NaN);
  const [incomesRaw, setIncomesRaw] = useState<IIncome[] | null>(null);
  const [totalIncomes, setTotalIncomes] = useState<number>(NaN);

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsRaw(await getAllAccounts());
    };
    fetchAccounts();

    const fetchExpenses = async () => {
      setExpensesRaw(await getAllExpenses());
    };
    fetchExpenses();

    const fetchIncomes = async () => {
      setIncomesRaw(await getAllIncomes());
    };
    fetchIncomes();
  }, []);

  useEffect(() => {
    if (accountsRaw === null) return;

    const total = accountsRaw.reduce(
      (currentTotal, { balance, type }) =>
        currentTotal + (type !== 'loan' ? balance : 0),
      0
    );

    setTotalBalance(total);
  }, [accountsRaw]);

  useEffect(() => {
    if (incomesRaw === null) return;

    const total = incomesRaw.reduce((currentTotal, { amount, date }) => {
      const currentMonth = new Date().getMonth() + 1;
      const month = new Date(date).getMonth() + 1;
      const currentYear = new Date().getFullYear();

      if (
        currentMonth === month &&
        currentYear === new Date(date).getFullYear()
      ) {
        return currentTotal + amount;
      }

      return currentTotal;
    }, 0);

    setTotalIncomes(total);
  }, [incomesRaw]);

  useEffect(() => {
    if (expensesRaw === null) return;

    const total = expensesRaw.reduce((currentTotal, { amount, date }) => {
      const currentMonth = new Date().getMonth() + 1;
      const month = new Date(date).getMonth() + 1;
      const currentYear = new Date().getFullYear();

      if (
        currentMonth === month &&
        currentYear === new Date(date).getFullYear()
      ) {
        return currentTotal + amount;
      }

      return currentTotal;
    }, 0);

    setTotalExpenses(total);
  }, [expensesRaw]);

  return (
    <section className={`bg-white border rounded-lg ${className}`}>
      <dl className="relative px-6 pt-10 pb-6 border-b">
        <dt className="text-sm text-gray-700 font-medium truncate lg:text-base absolute top-4 left-6">
          Balance
        </dt>
        <dd className="text-3xl font-bold tracking-tight">
          {Number.isNaN(totalBalance) ? '-' : formatCurrency(totalBalance)}
        </dd>
      </dl>
      <section className="grid grid-cols-2 divide-x">
        <dl className="py-4 pl-6 pr-4">
          <dt className="text-xs text-gray-700 font-medium truncate lg:text-sm">
            Income
          </dt>
          <dd className="text-xl font-bold tracking-tight">
            {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
          </dd>
        </dl>
        <dl className="py-4 pl-6 pr-4">
          <dt className="text-xs text-gray-700 font-medium truncate lg:text-sm">
            Expenses
          </dt>
          <dd className="text-xl font-bold tracking-tight">
            {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
          </dd>
        </dl>
      </section>
    </section>
  );
};
