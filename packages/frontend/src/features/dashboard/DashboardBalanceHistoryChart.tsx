'use client';

import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';

import { AreaStackedChart, ChartConfig } from '$charts/AreaStackedChart';
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

export const DashboardBalanceHistoryChart: FC<
  DashboardBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = useMemo(
    () =>
      data.map(({ date, balance }) => ({
        dataKey: formatDate(date, DateFormat.monthLong),
        balance,
      })),
    [data],
  );

  const chartConfig = {
    balance: {
      label: 'Balance',
      color: 'hsl(var(--color-blue))',
      valueFormatter: formatCurrency,
    },
  } satisfies ChartConfig;

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
        chartConfig={chartConfig}
        yaxisTickFormatter={(value: number) => {
          return formatCurrencyAbbreviation(value);
        }}
        xaxisTickFormatter={(value: string) => {
          return formatDate(new Date(value), DateFormat.month);
        }}
      />
    </div>
  );
};
