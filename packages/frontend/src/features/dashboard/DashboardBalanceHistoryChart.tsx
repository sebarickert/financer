'use client';

import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { AreaStackedChart } from '$charts/AreaStackedChart';
import {
  ChartFilterByMonthsSelect,
  monthFilterOptions,
} from '$charts/ChartFilterByMonthsSelect';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';

type DashboardBalanceHistoryChartProps = {
  data: { date: Date; balance: number }[];
  className?: string;
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="grid gap-1 p-2 text-xs border rounded-md bg-layer">
        <p className="font-medium text-foreground">
          {payload[0].payload.dataKey}
        </p>
        <ul className="space-y-1">
          {payload.map((entry) => (
            <li key={entry.dataKey}>
              <p className="grid grid-cols-[auto,1fr] gap-4 items-center">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <span
                    className={clsx(
                      'inline-block w-2.5 h-2.5 rounded-sm bg-blue',
                    )}
                  />
                  Balance
                </span>
                <span className="text-right text-foreground">
                  {formatCurrency(entry.value as number)}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <div />;
};

export const DashboardBalanceHistoryChart: FC<
  DashboardBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = useMemo(
    () =>
      data.map(({ date, balance }) => ({
        dataKey: formatDate(date, DateFormat.monthShort),
        data: [
          {
            key: 'balance',
            color: 'hsl(var(--color-blue))',
            value: balance,
          },
        ],
      })),
    [data],
  );

  const defaultFilterValue = useMemo(
    () =>
      chartData.length < 6
        ? monthFilterOptions.THREE_MONTHS.value
        : chartData.length === 6
          ? monthFilterOptions.SIX_MONTHS.value
          : chartData.length < 12
            ? monthFilterOptions.ALL.value
            : monthFilterOptions.TWELVE_MONTHS.value,
    [chartData.length],
  );

  const [selectedFilter, setSelectedFilter] =
    useState<
      (typeof monthFilterOptions)[keyof typeof monthFilterOptions]['value']
    >(defaultFilterValue);

  const filteredChartData = chartData.slice(-selectedFilter);

  return (
    <div className={clsx(className, 'bg-layer rounded-md overflow-hidden')}>
      <div className="grid justify-end gap-2 p-4 lg:p-6">
        <ChartFilterByMonthsSelect
          dataCount={chartData.length}
          defaultValue={selectedFilter}
          onFilterSelect={setSelectedFilter}
        />
      </div>
      <AreaStackedChart
        chartData={filteredChartData}
        yaxisTickFormatter={(value: number) => {
          return formatCurrencyAbbreviation(value);
        }}
        customTooltip={CustomTooltip}
      />
    </div>
  );
};
