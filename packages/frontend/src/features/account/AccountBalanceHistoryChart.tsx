'use client';

import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';

import { AccountBalanceHistoryDto } from '$api/generated/financerApi';
import { AreaStackedChart } from '$charts/AreaStackedChart';
import {
  ChartFilterByMonthsSelect,
  monthFilterOptions,
} from '$charts/ChartFilterByMonthsSelect';
import { DateService } from '$services/DateService';
import { ChartConfig } from '$types/ChartConfig';
import { ChartData } from '$types/ChartData';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '$utils/formatCurrency';

type AccountBalanceHistoryChartProps = {
  data: AccountBalanceHistoryDto[];
  className?: string;
};

export const AccountBalanceHistoryChart: FC<
  AccountBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = data.map(({ date, balance }) => ({
    dataKey: DateService.format({
      date,
      format: DateService.DATE_FORMAT.MONTH_WITH_DATE_SHORT_WITH_YEAR,
    }),
    balance,
  }));

  const groupedChartData = Object.values(
    Object.groupBy(chartData, ({ dataKey }) => {
      const dt = DateService.parseFormat(
        dataKey,
        DateService.DATE_FORMAT.MONTH_WITH_DATE_SHORT_WITH_YEAR,
      );

      return dt.toFormat(DateService.DATE_FORMAT.YEAR_MONTH);
    }),
  );

  const chartConfig = {
    balance: {
      label: 'Balance',
      color: 'var(--color-blue)',
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
        data={filteredChartData}
        config={chartConfig}
        yaxisTickFormatter={(value: number) => {
          return formatCurrencyAbbreviation(value);
        }}
        xaxisTickFormatter={(value: string) =>
          DateService.parseFormat(
            value,
            DateService.DATE_FORMAT.MONTH_WITH_DATE_SHORT_WITH_YEAR,
          ).toFormat(DateService.DATE_FORMAT.MONTH_WITH_DATE_SHORT)
        }
      />
    </div>
  );
};
