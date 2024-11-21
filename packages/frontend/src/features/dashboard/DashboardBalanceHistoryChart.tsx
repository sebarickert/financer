'use client';

import clsx from 'clsx';
import { ChangeEvent, FC, useState } from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { AreaStackedChart } from '$charts/AreaStackedChart';
import { filterOptions } from '$features/statistics/StatisticsOverviewData';
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

const yaxisTickFormatter = (value: number) => {
  return formatCurrencyAbbreviation(value);
};

export const DashboardBalanceHistoryChart: FC<
  DashboardBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = data.map(({ date, balance }) => ({
    dataKey: formatDate(date, DateFormat.monthShort),
    data: [
      {
        key: 'balance',
        color: 'hsl(var(--color-blue))',
        value: balance,
      },
    ],
  }));

  const defaultFilterValue =
    chartData.length < 6
      ? filterOptions.THREE_MONTHS.value
      : chartData.length === 6
        ? filterOptions.SIX_MONTHS.value
        : chartData.length < 12
          ? filterOptions.ALL.value
          : filterOptions.TWELVE_MONTHS.value;

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

  const filteredChartData = chartData.slice(-selectedFilter);

  const filteredOptions = Object.values(filterOptions).filter(({ value }) => {
    const { THREE_MONTHS, SIX_MONTHS, TWENTYFOUR_MONTHS, TWELVE_MONTHS, ALL } =
      filterOptions;

    if (chartData.length <= 3) {
      return value === THREE_MONTHS.value;
    }

    if (chartData.length < 6) {
      return value === THREE_MONTHS.value || value === ALL.value;
    }

    if (chartData.length === 6) {
      return value === THREE_MONTHS.value || value === SIX_MONTHS.value;
    }

    if (chartData.length < 12) {
      return (
        value === THREE_MONTHS.value ||
        value === SIX_MONTHS.value ||
        value === ALL.value
      );
    }

    if (chartData.length === 12) {
      return (
        value === THREE_MONTHS.value ||
        value === SIX_MONTHS.value ||
        value === TWELVE_MONTHS.value
      );
    }

    if (chartData.length < 24) {
      return (
        value === THREE_MONTHS.value ||
        value === SIX_MONTHS.value ||
        value === TWELVE_MONTHS.value ||
        value === ALL.value
      );
    }

    if (chartData.length === 24) {
      return (
        value === THREE_MONTHS.value ||
        value === SIX_MONTHS.value ||
        value === TWELVE_MONTHS.value ||
        value === TWENTYFOUR_MONTHS.value
      );
    }

    return true;
  });

  return (
    <div className={clsx(className, 'bg-layer rounded-md overflow-hidden')}>
      <div className="grid justify-end gap-2 p-4 lg:p-6">
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
        yaxisTickFormatter={yaxisTickFormatter}
        customTooltip={CustomTooltip}
      />
    </div>
  );
};
