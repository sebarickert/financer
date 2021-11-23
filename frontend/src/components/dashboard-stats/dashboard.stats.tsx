import React, { useEffect, useState } from 'react';

import { getAllAccounts } from '../../pages/accounts/AccountService';
import { getAllExpenses } from '../../pages/expenses/ExpenseService';
import { getAllIncomes } from '../../pages/income/IncomeService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Stats } from '../stats/stats';
import { StatsGroup } from '../stats/stats.group';
import { StatsItem } from '../stats/stats.item';

interface IDashboardStatsProps {
  label?: string;
  className?: string;
}

export const DashboardStats = ({
  label,
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
    <section className={` ${className}`}>
      <Stats className={`${className}`} label={label}>
        <StatsItem statLabel="Balance" type="standalone">
          {Number.isNaN(totalBalance) ? '-' : formatCurrency(totalBalance)}
        </StatsItem>
        <StatsGroup>
          <StatsItem statLabel="Income">
            {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
          </StatsItem>
          <StatsItem statLabel="Expenses">
            {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
          </StatsItem>
        </StatsGroup>
      </Stats>
    </section>
  );
};
