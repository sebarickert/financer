'use client';

import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';

import { AreaStackedChart } from '@/charts/AreaStackedChart';
import {
  ChartFilterByMonthsSelect,
  monthFilterOptions,
} from '@/charts/ChartFilterByMonthsSelect';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import { ChartConfig } from '@/types/ChartConfig';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '@/utils/formatCurrency';

interface DashboardBalanceHistoryChartProps {
  data: { date: Date; balance: number }[];
  className?: string;
}

export const DashboardBalanceHistoryChart: FC<
  DashboardBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = useMemo(
    () =>
      data.map(({ date, balance }) => ({
        dataKey: new DateService(date).format(DATE_FORMAT.MONTH_LONG),
        balance,
      })),
    [data],
  );

  const chartConfig = {
    balance: {
      label: 'Balance',
      color: 'var(--color-blue)',
      valueFormatter: (value) => formatCurrency(value as number),
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
        data={filteredChartData}
        config={chartConfig}
        yaxisTickFormatter={(value) => {
          return formatCurrencyAbbreviation(value as number);
        }}
        xaxisTickFormatter={(value) =>
          DateService.parseFormat(
            value as string,
            DATE_FORMAT.MONTH_LONG,
          ).toFormat(DATE_FORMAT.MONTH)
        }
      />
    </div>
  );
};
