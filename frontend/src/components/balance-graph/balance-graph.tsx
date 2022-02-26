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

import { useAllAccountsByType } from '../../hooks/account/useAllAccounts';
import {
  useAllExpenses,
  useAllExpensesGroupByMonth,
} from '../../hooks/expense/useAllExpenses';
import {
  useAllIncomes,
  useAllIncomesGroupByMonth,
} from '../../hooks/income/useAllIncomes';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';
import { Heading } from '../heading/heading';
import { Loader } from '../loader/loader';

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

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>): JSX.Element => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-2 bg-gray-800 shadow-lg">
        <p className="text-white">
          Balance {formatCurrency(payload[0].value as number)}
        </p>
        <p className="text-white">{formatDateShort(new Date(label))}</p>
      </div>
    );
  }

  return <div />;
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
        <Tooltip content={CustomTooltip} isAnimationActive={false} />
        <YAxis dataKey="balance" domain={['dataMin - 1000', 'auto']} hide />
        <XAxis
          dataKey="dateStr"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: '14px' }}
          tickMargin={10}
          height={40}
          interval={1}
          tickFormatter={(tick, index) => {
            if (index === 0 || index === 6) return '';

            return formatDateShort(new Date(tick));
          }}
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
  const totalBalance = useTotalBalance();
  const allIncomes = useAllIncomes();
  const allExpenses = useAllExpenses();
  const [groupedIncomes] = useAllIncomesGroupByMonth(['loan']);
  const [groupedExpenses] = useAllExpensesGroupByMonth(['loan']);

  const [balanceHistory, setBalanceHistory] = useState<null | BalanceHistory[]>(
    null
  );

  useEffect(() => {
    if (!totalBalance || !allIncomes || !allExpenses) return;

    const now = new Date();

    const groupedIncomesFormatted = groupedIncomes.map(
      ({ month, year, total }) => ({
        date: new Date(`${year}-${month + 1}-01`),
        amount: total,
      })
    );

    const groupedExpensesFormatted = groupedExpenses.map(
      ({ month, year, total }) => ({
        date: new Date(`${year}-${month + 1}-01`),
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
        [{ date: now, balance: totalBalance }]
      );

    setBalanceHistory(newBalanceHistory);
  }, [allExpenses, allIncomes, groupedExpenses, groupedIncomes, totalBalance]);

  return (
    <section
      className={`bg-white rounded-lg border ${className} aspect-video md:aspect-auto relative`}
    >
      {balanceHistory === null ? (
        <Loader loaderColor="blue" />
      ) : (
        <>
          <Heading style="h4" className="absolute top-4 left-4">
            Balance history
          </Heading>
          <SimpleLineChart data={balanceHistory} />
        </>
      )}
    </section>
  );
};
