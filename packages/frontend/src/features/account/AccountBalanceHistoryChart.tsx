'use client';

import clsx from 'clsx';
import { parse } from 'date-fns';
import { FC, useMemo, useState } from 'react';

import { AccountBalanceHistoryDto } from '$api/generated/financerApi';
import {
  AreaStackedChart,
  ChartConfig,
  ChartData,
} from '$charts/AreaStackedChart';
import {
  ChartFilterByMonthsSelect,
  monthFilterOptions,
} from '$charts/ChartFilterByMonthsSelect';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';

type AccountBalanceHistoryChartProps = {
  data: AccountBalanceHistoryDto[];
  className?: string;
};

export const AccountBalanceHistoryChart: FC<
  AccountBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = data.map(({ date, balance }) => ({
    dataKey: formatDate(new Date(date), DateFormat.monthWithDateShortWithYear),
    balance,
  }));

  const groupedChartData = Object.values(
    Object.groupBy(chartData, ({ dataKey }) => {
      const date = new Date(dataKey);

      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    }),
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
      groupedChartData.length < 6
        ? monthFilterOptions.THREE_MONTHS.value
        : groupedChartData.length === 6
          ? monthFilterOptions.SIX_MONTHS.value
          : groupedChartData.length < 12
            ? monthFilterOptions.ALL.value
            : monthFilterOptions.TWELVE_MONTHS.value,
    [groupedChartData.length],
  );

  const [selectedFilter, setSelectedFilter] =
    useState<
      (typeof monthFilterOptions)[keyof typeof monthFilterOptions]['value']
    >(defaultFilterValue);

  const filteredChartData = groupedChartData
    .slice(-selectedFilter)
    .flat() as ChartData;

  return (
    <div className={clsx(className, 'bg-layer rounded-md overflow-hidden')}>
      <div className="grid justify-end gap-2 p-4 lg:p-6">
        <ChartFilterByMonthsSelect
          dataCount={groupedChartData.length}
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
          const parsedDate = parse(
            value,
            DateFormat.monthWithDateShortWithYear,
            new Date(),
          );
          return formatDate(parsedDate, DateFormat.monthWithDateShort);
        }}
      />
    </div>
  );
};
