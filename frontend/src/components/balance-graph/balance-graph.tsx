import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Tooltip,
  YAxis,
  XAxis,
  Area,
  Brush,
  CartesianGrid,
  TooltipProps,
} from 'recharts';

import { MONTH_IN_MS } from '../../constants/months';
import { useAllAccountsByType } from '../../hooks/useAllAccounts';
import { useAllExpenses } from '../../hooks/useAllExpenses';
import { useAllIncomes } from '../../hooks/useAllIncomes';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
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
}: TooltipProps): JSX.Element => {
  if (active && payload && payload.length) {
    return (
      <div className="py-2 px-4 bg-gray-800 shadow-lg">
        <p className="text-white">
          Balance {formatCurrency(payload[0].value as number)}
        </p>
        <p className="text-white">{label}</p>
      </div>
    );
  }

  return <div />;
};

const SimpleLineChart = ({ data }: ISimpleLineChartProps): JSX.Element => {
  return (
    <div className="bg-white rounded-lg border pl-2 py-6 pr-6 w-full">
      <div style={{ width: '100%', height: '33vh', minHeight: '450px' }}>
        <ResponsiveContainer>
          <AreaChart
            data={data.map(({ date, balance }) => ({
              dateStr: formatDate(date),
              date,
              balance,
            }))}
          >
            <defs>
              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1c64f2" stopOpacity={0.4} />
                <stop offset="75%" stopColor="#1c64f2" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Tooltip content={CustomTooltip} />
            {/* <YAxis
              dataKey="balance"
              axisLine={false}
              tickLine={false}
              tickCount={6}
              domain={['dataMin', 'dataMax']}
              tickFormatter={(number) => formatCurrency(number)}
              width={105}
            /> */}
            <XAxis
              dataKey="dateStr"
              axisLine={false}
              tickLine={false}
              tickMargin={15}
              height={50}
            />
            <Area
              dataKey="balance"
              stroke="#1c64f2"
              fill="url(#color)"
              strokeWidth={2}
            />
            <CartesianGrid vertical={false} opacity={0.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const BalanceGraph = ({
  className = '',
}: BalanceGraphProps): JSX.Element => {
  const totalBalance = useTotalBalance();
  const allIncomes = useAllIncomes();
  const allExpenses = useAllExpenses();
  const [allLoanAccounts] = useAllAccountsByType(['loan']);

  const [balanceHistory, setBalanceHistory] = useState<null | BalanceHistory[]>(
    null
  );

  useEffect(() => {
    if (!totalBalance || !allIncomes || !allExpenses) return;

    const now = new Date();
    const loanAccountIds = allLoanAccounts?.map(({ _id }) => _id);

    const allIncomesAndExpenses = [
      ...allIncomes
        .filter(({ toAccount }) => !loanAccountIds?.includes(toAccount))
        .map(({ date, amount }) => ({
          date: new Date(date),
          amount,
        })),
      ...allExpenses
        .filter(({ fromAccount }) => !loanAccountIds?.includes(fromAccount))
        .map(({ date, amount }) => ({
          date: new Date(date),
          amount: amount * -1,
        })),
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
  }, [allExpenses, allIncomes, allLoanAccounts, totalBalance]);

  return balanceHistory === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <div
      className={`bg-white border rounded-lg flex items-center justify-center aspect-video md:aspect-auto w-full ${className}`}
    >
      <SimpleLineChart data={balanceHistory} />
    </div>
  );
};
