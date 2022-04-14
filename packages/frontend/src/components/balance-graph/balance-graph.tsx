import { AccountType } from '@local/types';
import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Tooltip,
  YAxis,
  XAxis,
  Area,
  CartesianGrid,
  TooltipProps,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import {
  useAllExpenses,
  useAllExpensesGroupByMonth,
} from '../../hooks/expense/useAllExpenses';
import {
  useAllIncomes,
  useAllIncomesGroupByMonth,
} from '../../hooks/income/useAllIncomes';
import { useAllTransactions } from '../../hooks/transaction/useAllTransactions';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';
import { Loader, LoaderColor } from '../loader/loader';

interface BalanceGraphProps {
  className?: string;
}

type BalanceHistory = {
  date: Date;
  balance: number;
};

interface ISimpleLineChartProps {
  data: BalanceHistory[];
}

type TooltopPropsWithLastDataItem = TooltipProps<ValueType, NameType> & {
  lastDataItem: BalanceHistory;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  lastDataItem,
}: TooltopPropsWithLastDataItem): JSX.Element => {
  if (active && payload && payload.length && lastDataItem) {
    const isLastItem =
      lastDataItem.date.getTime() === new Date(label).getTime();

    return (
      <div className="px-4 py-2 bg-gray-800 rounded-md shadow-lg">
        <p className="text-white">
          Balance {formatCurrency(payload[0].value as number)}
        </p>
        <p className="text-white">
          {isLastItem ? 'Current' : formatDateShort(new Date(label))}
        </p>
      </div>
    );
  }

  return <div />;
};

const CustomXAxisTick = ({
  x,
  y,
  payload,
  index,
}: {
  x: number;
  y: number;
  payload: { value: string };
  index: number;
}) => {
  if (index === 0 || index === 6) return null;

  return (
    <g className={`text-xs md:text-sm`}>
      <text x={x} y={y + 18} textAnchor="middle" fill="#666">
        {formatDateShort(new Date(payload.value))}
      </text>
    </g>
  );
};

const SimpleLineChart = ({ data }: ISimpleLineChartProps): JSX.Element => {
  return (
    <ResponsiveContainer>
      <AreaChart
        data={data.map(({ date, balance }) => ({
          dateStr: date.toISOString(),
          date,
          balance,
        }))}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c64f2" stopOpacity={0.4} />
            <stop offset="75%" stopColor="#1c64f2" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Tooltip
          content={(props) => (
            <CustomTooltip {...props} lastDataItem={data[data.length - 1]} />
          )}
          isAnimationActive={false}
        />
        <YAxis dataKey="balance" domain={['dataMin - 1000', 'auto']} hide />
        <XAxis
          dataKey="dateStr"
          axisLine={false}
          tickLine={false}
          height={40}
          interval={1}
          tick={(props) => <CustomXAxisTick {...props} />}
        />
        <Area
          dataKey="balance"
          stroke="#1c64f2"
          fill="url(#color)"
          strokeWidth={2}
          isAnimationActive={false}
        />
        <CartesianGrid vertical={false} opacity={0.25} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const BalanceGraph = ({
  className = '',
}: BalanceGraphProps): JSX.Element => {
  const { data: totalBalance } = useTotalBalance();
  const allIncomes = useAllIncomes();
  const allExpenses = useAllExpenses();
  const [groupedIncomes] = useAllIncomesGroupByMonth([AccountType.loan]);
  const [groupedExpenses] = useAllExpensesGroupByMonth([AccountType.loan]);
  const allTransactions = useAllTransactions();
  const [balanceHistory, setBalanceHistory] = useState<null | BalanceHistory[]>(
    null
  );

  useEffect(() => {
    if (!totalBalance || !allIncomes || !allExpenses || !allTransactions)
      return;

    const now = new Date();

    const getDateFromYearAndMonth = (year: number, month: number): Date =>
      new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-01`);

    const groupedIncomesFormatted = groupedIncomes.map(
      ({ month, year, total }) => ({
        date: getDateFromYearAndMonth(year, month),
        amount: total,
      })
    );

    const groupedExpensesFormatted = groupedExpenses.map(
      ({ month, year, total }) => ({
        date: getDateFromYearAndMonth(year, month),
        amount: total * -1,
      })
    );

    const allIncomesAndExpenses = [
      ...groupedIncomesFormatted.map(({ date, amount }) => ({
        date,
        amount:
          amount +
          (groupedExpensesFormatted.find(
            ({ date: expenseDate }) => expenseDate.getTime() === date.getTime()
          )?.amount || 0),
      })),
      ...groupedExpensesFormatted.filter(
        ({ date }) =>
          !groupedIncomesFormatted.some(
            ({ date: incomeDate }) => incomeDate.getTime() === date.getTime()
          )
      ),
    ];

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
  }, [
    allExpenses,
    allIncomes,
    allTransactions,
    groupedExpenses,
    groupedIncomes,
    totalBalance,
  ]);

  return (
    <section
      className={`bg-gray-25 rounded-lg border ${className} aspect-video md:aspect-auto relative`}
    >
      {balanceHistory === null ? (
        <Loader loaderColor={LoaderColor.blue} className="h-full scale-50" />
      ) : (
        <>
          <SimpleLineChart data={balanceHistory} />
        </>
      )}
    </section>
  );
};
