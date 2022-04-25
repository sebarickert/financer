import { useEffect, useState, useTransition } from 'react';

import { useExpenseMonthlySummaries } from '../../hooks/expense/useExpenseMonthlySummaries';
import { useIncomeMonthlySummaries } from '../../hooks/income/useIncomeMonthlySummaries';
import { useAllTransactions } from '../../hooks/transaction/useAllTransactions';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { LoaderIfProcessing } from '../loader/loader-if-processing';

import { BalanceHistory, SimpleLineChart } from './simple-line-chart';

interface BalanceGraphProps {
  className?: string;
}

const yearAgoFilterOptions = {
  year: new Date().getFullYear() - 1,
  month: new Date().getMonth(),
};

export const BalanceGraph = ({
  className = '',
}: BalanceGraphProps): JSX.Element => {
  const [isProcessing, startProcessing] = useTransition();
  const totalBalance = useTotalBalance();
  const allTransactions = useAllTransactions();
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);

  const incomeMonthSummaries = useIncomeMonthlySummaries(yearAgoFilterOptions);
  const expenseMonthSummaries =
    useExpenseMonthlySummaries(yearAgoFilterOptions);

  useEffect(() => {
    startProcessing(() => {
      const now = new Date();

      const getDateFromYearAndMonth = (year: number, month: number): Date =>
        new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-01`);

      const groupedIncomesFormatted = incomeMonthSummaries.map(
        ({ _id: { month, year }, totalAmount }) => ({
          date: getDateFromYearAndMonth(year, month),
          amount: totalAmount,
        })
      );

      const groupedExpensesFormatted = expenseMonthSummaries.map(
        ({ _id: { month, year }, totalAmount }) => ({
          date: getDateFromYearAndMonth(year, month),
          amount: totalAmount * -1,
        })
      );

      const allIncomesAndExpenses = [
        ...groupedIncomesFormatted.map(({ date, amount }) => ({
          date,
          amount:
            amount +
            (groupedExpensesFormatted.find(
              ({ date: expenseDate }) =>
                expenseDate.getTime() === date.getTime()
            )?.amount || 0),
        })),
        ...groupedExpensesFormatted.filter(
          ({ date }) =>
            !groupedIncomesFormatted.some(
              ({ date: incomeDate }) => incomeDate.getTime() === date.getTime()
            )
        ),
      ];

      console.log(allIncomesAndExpenses);

      const latestTransactionTimestamp = new Date(
        allTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )?.[0]?.date ?? now
      );

      const oldestVisibleDate = new Date();

      oldestVisibleDate.setFullYear(oldestVisibleDate.getFullYear() - 1);

      const newBalanceHistory = allIncomesAndExpenses
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .filter(({ date }) => date > oldestVisibleDate)
        .reduce(
          (previousBalance, { date, amount }) => {
            const { balance: latestBalance } = previousBalance[0];
            const currentBalance = { date, balance: latestBalance - amount };
            return [currentBalance, ...previousBalance];
          },
          [{ date: latestTransactionTimestamp, balance: totalBalance }]
        );

      setBalanceHistory(newBalanceHistory);
    });
  }, [
    allTransactions,
    expenseMonthSummaries,
    incomeMonthSummaries,
    totalBalance,
  ]);

  return (
    <section
      className={`bg-gray-25 rounded-lg border ${className} aspect-video md:aspect-auto relative`}
    >
      <LoaderIfProcessing isProcessing={isProcessing}>
        <SimpleLineChart data={balanceHistory} />
      </LoaderIfProcessing>
    </section>
  );
};
