'use client';

import clsx from 'clsx';
import { ChangeEvent, FC, useState } from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { TransactionMonthSummaryDto } from '$api/generated/financerApi';
import { AreaStackedChart } from '$blocks/AreaStackedChart';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';

type StatisticsOverviewDataProps = {
  data: (Omit<TransactionMonthSummaryDto, 'id'> & { date: Date })[];
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 text-sm border rounded-md theme-layer-color theme-text-primary theme-border-primary">
        <p className="mb-2 font-medium">{payload[0].payload.dataKey}</p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="grid gap-4 grid-cols-[1fr,auto] uppercase"
          >
            <span>{entry.dataKey}</span>
            <span className="text-right">
              {formatCurrency(entry.value as number)}
            </span>
          </p>
        ))}
      </div>
    );
  }

  return <div />;
};

const yaxisTickFormatter = (value: number) => {
  return formatCurrencyAbbreviation(value);
};

const filterOptions = {
  THREE_MONTHS: {
    label: 'Last 3 Months',
    value: 3,
  },
  SIX_MONTHS: {
    label: 'Last 6 Months',
    value: 6,
  },
  YEAR: {
    label: 'Last 12 Months',
    value: 12,
  },
} as const;

export const StatisticsOverviewData: FC<StatisticsOverviewDataProps> = ({
  data,
}) => {
  const chartData = data.map(({ date, incomeAmount, expenseAmount }) => ({
    dataKey: formatDate(date, DateFormat.monthShort),
    key1: {
      key: 'incomes',
      fill: '#198038',
      value: incomeAmount,
    },
    key2: {
      key: 'expenses',
      fill: '#da1e28',
      value: expenseAmount,
    },
  }));

  const defaultFilterValue =
    chartData.length <= 3
      ? filterOptions.THREE_MONTHS.value
      : chartData.length <= 6
        ? filterOptions.SIX_MONTHS.value
        : filterOptions.YEAR.value;

  const [selectedFilter, setSelectedFilter] =
    useState<(typeof filterOptions)[keyof typeof filterOptions]['value']>(
      defaultFilterValue,
    );

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(
      event.target.value,
    ) as (typeof filterOptions)[keyof typeof filterOptions]['value'];

    setSelectedFilter(value);
  };

  if (chartData.length < 3) {
    return (
      <EmptyContentBlock title="Not Enough Data Yet" icon="RectangleGroupIcon">
        It seems there isn&apos;t enough data to generate a meaningful summary.
        Start by adding more transactions to see an overview of your monthly
        activity.
      </EmptyContentBlock>
    );
  }

  const filteredChartData = chartData.slice(-selectedFilter);

  const filteredOptions = Object.values(filterOptions).filter(({ value }) => {
    const { THREE_MONTHS, SIX_MONTHS } = filterOptions;

    if (chartData.length <= 3) {
      return value === THREE_MONTHS.value;
    }

    if (chartData.length <= 6) {
      return value === THREE_MONTHS.value || value === SIX_MONTHS.value;
    }

    return true;
  });

  return (
    <div className="overflow-hidden rounded-md theme-layer-color">
      <div className="flex justify-end p-6">
        <select
          className={clsx(
            'theme-field-inverse',
            'block rounded-md',
            'py-3 h-12',
          )}
          defaultValue={selectedFilter}
          onChange={handleChange}
        >
          {filteredOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <AreaStackedChart
        chartData={filteredChartData}
        colors={{ key1: '#198038', key2: '#da1e28' }}
        yaxisTickFormatter={yaxisTickFormatter}
        customTooltip={CustomTooltip}
      />
    </div>
  );
};
