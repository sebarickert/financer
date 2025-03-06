'use client';

import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';

import { SchemaAccountBalanceHistoryDto } from '@/api/ssr-financer-api';
import { AreaStackedChart } from '@/charts/AreaStackedChart';
import {
  ChartFilterByMonthsSelect,
  monthFilterOptions,
} from '@/charts/ChartFilterByMonthsSelect';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import { ChartConfig } from '@/types/ChartConfig';
import { ChartData } from '@/types/ChartData';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '@/utils/formatCurrency';

interface AccountBalanceHistoryChartProps {
  data: SchemaAccountBalanceHistoryDto[];
  className?: string;
}

export const AccountBalanceHistoryChart: FC<
  AccountBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = data.map(({ date, balance }) => ({
    dataKey: new DateService(date).format(
      DATE_FORMAT.MONTH_WITH_DATE_SHORT_WITH_YEAR,
    ),
    balance,
  }));

  const groupedChartData = Object.values(
    Object.groupBy(chartData, ({ dataKey }) => {
      const dt = DateService.parseFormat(
        dataKey,
        DATE_FORMAT.MONTH_WITH_DATE_SHORT_WITH_YEAR,
      );

      return dt.toFormat(DATE_FORMAT.YEAR_MONTH);
    }),
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
        data={filteredChartData}
        config={chartConfig}
        yaxisTickFormatter={(value) => {
          return formatCurrencyAbbreviation(value as number);
        }}
        xaxisTickFormatter={(value) =>
          DateService.parseFormat(
            value as string,
            DATE_FORMAT.MONTH_WITH_DATE_SHORT_WITH_YEAR,
          ).toFormat(DATE_FORMAT.MONTH_WITH_DATE_SHORT)
        }
      />
    </div>
  );
};
