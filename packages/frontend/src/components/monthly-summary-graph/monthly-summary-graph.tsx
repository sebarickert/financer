import { useEffect, useState, useTransition } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

import { useExpenseMonthlySummaries } from '../../hooks/expense/useExpenseMonthlySummaries';
import { useIncomeMonthlySummaries } from '../../hooks/income/useIncomeMonthlySummaries';
import { useUserStatisticsSettings } from '../../hooks/profile/user-preference/useStatisticsSettings';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';
import { LoaderIfProcessing } from '../loader/loader-if-processing';

import { CustomXAxisTick } from './simple-line-chart';

interface BalanceGraphProps {
  className?: string;
}

const yearAgoFilterOptions = {
  year: new Date().getFullYear() - 1,
  month: new Date().getMonth(),
};

const getDateFromYearAndMonth = (year: number, month: number): Date =>
  new Date(`${year}-${month.toString().padStart(2, '0')}-01`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeDuplicatesFromArray = (array: any[]) => Array.from(new Set(array));

type MonthlySummaryHistory = {
  year: number;
  month: number;
  date: Date;
  incomes: number;
  expenses: number;
  netStatus: number;
};

type TooltopPropsWithLastDataItem = TooltipProps<ValueType, NameType> & {
  lastDataItem: MonthlySummaryHistory;
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

    const netStatusValue = (payload.find(
      ({ dataKey }) => dataKey === 'netStatus'
    )?.value ?? 0) as number;

    const incomesValue = (payload.find(({ dataKey }) => dataKey === 'incomes')
      ?.value ?? 0) as number;

    const expensesValue = (payload.find(({ dataKey }) => dataKey === 'expenses')
      ?.value ?? 0) as number;

    return (
      <div className="px-4 py-2 bg-gray-800 rounded-md shadow-lg">
        <p className="text-white">Net total {formatCurrency(netStatusValue)}</p>
        <p className="text-white">Incomes {formatCurrency(incomesValue)}</p>
        <p className="text-white">Expenses {formatCurrency(expensesValue)}</p>
        <p className="text-white">
          {isLastItem ? 'Current' : formatDateShort(new Date(label))}
        </p>
      </div>
    );
  }

  return <div />;
};

export const MonthlySummaryGraph = ({
  className = '',
}: BalanceGraphProps): JSX.Element => {
  const [isProcessing, startProcessing] = useTransition();
  const [monthlySummaryHistory, setMonthlySummaryHistory] = useState<
    MonthlySummaryHistory[]
  >([]);

  const [statisticsSettings] = useUserStatisticsSettings();
  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const incomeMonthSummaries = useIncomeMonthlySummaries({
    ...yearAgoFilterOptions,
    ...accountTypeFilter,
  });
  const expenseMonthSummaries = useExpenseMonthlySummaries({
    ...yearAgoFilterOptions,
    ...accountTypeFilter,
  });

  useEffect(() => {
    startProcessing(() => {
      const allMonths = removeDuplicatesFromArray(
        [...incomeMonthSummaries, ...expenseMonthSummaries].map(({ _id }) =>
          JSON.stringify(_id)
        )
      ).map((item) => JSON.parse(item));

      setMonthlySummaryHistory(
        allMonths
          .map(({ year: targetYear, month: targetMonth }) => {
            const incomeSummary = incomeMonthSummaries.find(
              ({ _id: { year, month } }) =>
                year === targetYear && month === targetMonth
            );
            const expenseSummary = expenseMonthSummaries.find(
              ({ _id: { year, month } }) =>
                year === targetYear && month === targetMonth
            );

            const incomes = incomeSummary?.totalAmount ?? 0;
            const expenses = expenseSummary?.totalAmount ?? 0;

            return {
              year: targetYear,
              month: targetMonth,
              date: getDateFromYearAndMonth(targetYear, targetMonth),
              incomes,
              expenses,
              netStatus: incomes - expenses,
            };
          })
          .sort((a, b) => a.date.getTime() - b.date.getTime())
      );
    });
  }, [expenseMonthSummaries, incomeMonthSummaries]);

  return (
    <section
      className={`bg-gray-25 min-h-[300px] h-[20vh] md:h-auto md:min-h-0 md:aspect-video -mx-4 md:-mx-0 ${className}`}
    >
      <LoaderIfProcessing isProcessing={isProcessing}>
        <ResponsiveContainer>
          <ComposedChart
            data={monthlySummaryHistory.map(({ date, ...rest }) => ({
              dateStr: date.toISOString(),
              date,
              ...rest,
            }))}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  {...props}
                  lastDataItem={
                    monthlySummaryHistory[monthlySummaryHistory.length - 1]
                  }
                />
              )}
              isAnimationActive={false}
            />
            <YAxis
              dataKey="netStatus"
              domain={['data-min', 'auto']}
              orientation="right"
              hide
            />
            <YAxis
              dataKey="expenses"
              domain={[
                0,
                (dataMax: number) => (dataMax > 7500 ? 7500 : 'auto'),
              ]}
              yAxisId="income-expense"
              hide
              allowDataOverflow={true}
            />
            <YAxis
              dataKey="incomes"
              domain={[
                0,
                (dataMax: number) => (dataMax > 7500 ? 7500 : 'auto'),
              ]}
              yAxisId="income-expense"
              allowDataOverflow={true}
            />
            <XAxis
              dataKey="dateStr"
              axisLine={false}
              tickLine={false}
              height={40}
              interval={1}
              tick={(props) => <CustomXAxisTick {...props} />}
            />

            <Bar dataKey="incomes" fill="#059669" yAxisId="income-expense" />
            <Bar dataKey="expenses" fill="#dc2626" yAxisId="income-expense" />
            <Area
              dataKey="netStatus"
              stroke="#1c64f2"
              fill="url(#color)"
              strokeWidth={2}
              isAnimationActive={false}
            />
            <defs>
              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1c64f2" stopOpacity={0.4} />
                <stop offset="75%" stopColor="#1c64f2" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} opacity={0.25} />
          </ComposedChart>
        </ResponsiveContainer>
      </LoaderIfProcessing>
    </section>
  );
};
