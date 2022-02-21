import { useState, useEffect } from 'react';

import { getAllIncomes } from '../pages/income/IncomeService';

export const useAllIncomes = (): IIncome[] | null => {
  const [incomes, setIncomes] = useState<IIncome[] | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      setIncomes(await getAllIncomes());
    };

    fetchIncomes();
  }, []);

  return incomes;
};

export const useCurrentMonthIncomesTotalAmount = (): number => {
  const incomes = useAllIncomes();
  const [totalAmount, setTotalAmount] = useState(NaN);

  useEffect(() => {
    if (incomes === null) return;

    const total = incomes.reduce((currentTotal, { amount, date }) => {
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
  }, [incomes]);

  return totalAmount;
};
