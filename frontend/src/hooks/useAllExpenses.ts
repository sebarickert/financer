import { useState, useEffect } from 'react';

import { getAllExpenses } from '../pages/expenses/ExpenseService';

export const useAllExpenses = (): IExpense[] | null => {
  const [expenses, setExpenses] = useState<IExpense[] | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setExpenses(await getAllExpenses());
    };

    fetchExpenses();
  }, []);

  return expenses;
};

export const useCurrentMonthExpensesTotalAmount = (): number => {
  const expenses = useAllExpenses();
  const [totalAmount, setTotalAmount] = useState(NaN);

  useEffect(() => {
    if (expenses === null) return;

    const total = expenses.reduce((currentTotal, { amount, date }) => {
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

    setTotalAmount(total);
  }, [expenses]);

  return totalAmount;
};
