'use client';

import clsx from 'clsx';
import { ChangeEvent, FC, useState } from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { TransactionMonthSummaryDto } from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import { AreaStackedChart } from '$charts/AreaStackedChart';
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
      <div className="p-4 text-sm border rounded-md bg-[--color-layer] text-[--color-text-primary] border-[--color-border-primary]">
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
  TWELVE_MONTHS: {
    label: 'Last 12 Months',
    value: 12,
  },
  TWENTYFOUR_MONTHS: {
    label: 'Last 24 Months',
    value: 24,
  },
  ALL: {
    label: 'Full History',
    value: 0,
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

  const numbers = filteredChartData.reduce(
    (acc, { key1, key2 }) => {
      acc.incomes.push(key1.value);
      acc.expenses.push(key2.value);
      return acc;
    },
    { incomes: [] as number[], expenses: [] as number[] },
  );

  const average = {
    incomes:
      numbers.incomes.reduce((sum, num) => sum + num, 0) /
      numbers.incomes.length,
    expenses:
      numbers.expenses.reduce((sum, num) => sum + num, 0) /
      numbers.expenses.length,
  };

  const summaries = numbers.incomes.map(
    (income, index) => income - numbers.expenses[index],
  );

  const highest = {
    incomes: Math.max(...numbers.incomes),
    expenses: Math.max(...numbers.expenses),
  };

  const lowest = {
    incomes: Math.min(...numbers.incomes),
    expenses: Math.min(...numbers.expenses),
  };

  const generateTransactionsDetailsItem = (
    type: 'incomes' | 'expenses',
  ): DetailsItem[] => {
    return [
      {
        icon: 'DivideIcon',
        label: 'Average',
        description: formatCurrency(average[type]) ?? '-',
      },
      {
        icon: 'ArrowUpIcon',
        label: 'Highest',
        description: formatCurrency(highest[type]) ?? '-',
      },
      {
        icon: 'ArrowDownIcon',
        label: 'Lowest',
        description: formatCurrency(lowest[type]) ?? '-',
      },
    ];
  };

  const sumArray = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

  const summaryDetails: DetailsItem[] = [
    {
      icon: 'EqualsIcon',
      label: 'Balance',
      description:
        formatCurrency(
          sumArray(numbers.incomes) - sumArray(numbers.expenses),
        ) ?? '-',
    },
    {
      icon: 'ArrowUpIcon',
      label: 'Best Month',
      description: formatCurrency(Math.max(...summaries)) ?? '-',
    },
    {
      icon: 'ArrowDownIcon',
      label: 'Worst Month',
      description: formatCurrency(Math.min(...summaries)) ?? '-',
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-md bg-[--color-layer]">
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
      <div className="p-6 rounded-md bg-[--color-layer]">
        <DetailsList heading="Summary" items={summaryDetails} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="p-6 rounded-md bg-[--color-layer]">
          <DetailsList
            heading="Incomes"
            items={generateTransactionsDetailsItem('incomes')}
          />
        </div>
        <div className="p-6 rounded-md bg-[--color-layer]">
          <DetailsList
            heading="Expenses"
            items={generateTransactionsDetailsItem('expenses')}
          />
        </div>
      </div>
    </div>
  );
};
