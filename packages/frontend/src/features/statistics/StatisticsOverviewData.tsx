'use client';

import { FC, useMemo, useState } from 'react';

import { TransactionMonthSummaryDto } from '$api/generated/financerApi';
import { DetailsItem } from '$blocks/DetailList/details-list.item';
import { DetailsList } from '$blocks/DetailsList';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
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

type StatisticsOverviewDataProps = {
  data: (Omit<TransactionMonthSummaryDto, 'id'> & { date: Date })[];
};

export const StatisticsOverviewData: FC<StatisticsOverviewDataProps> = ({
  data,
}) => {
  const chartData = useMemo(
    () =>
      data.map(({ date, incomeAmount, expenseAmount }) => ({
        dataKey: formatDate(date, DateFormat.monthLong),
        incomes: incomeAmount,
        expenses: expenseAmount,
      })),
    [data],
  );

  const chartConfig = {
    incomes: {
      label: 'Incomes',
      color: 'hsl(var(--color-green))',
      valueFormatter: formatCurrency,
    },
    expenses: {
      label: 'Expenses',
      color: 'hsl(var(--color-red))',
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

  const incomes = filteredChartData.map((month) => month.incomes);
  const expenses = filteredChartData.map((month) => month.expenses);

  const average = {
    incomes: incomes.reduce((sum, num) => sum + num, 0) / incomes.length,
    expenses: expenses.reduce((sum, num) => sum + num, 0) / expenses.length,
  };

  const summaries = incomes.map((income, index) => income - expenses[index]);

  const highest = {
    incomes: Math.max(...incomes),
    expenses: Math.max(...expenses),
  };

  const lowest = {
    incomes: Math.min(...incomes),
    expenses: Math.min(...expenses),
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
        formatCurrency(sumArray(incomes) - sumArray(expenses)) ?? '-',
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
      <div className="overflow-hidden rounded-md bg-layer">
        <div className="flex justify-end p-4 lg:p-6">
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
      <div className="p-6 rounded-md bg-layer">
        <DetailsList heading="Summary" items={summaryDetails} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="p-6 rounded-md bg-layer">
          <DetailsList
            heading="Incomes"
            items={generateTransactionsDetailsItem('incomes')}
          />
        </div>
        <div className="p-6 rounded-md bg-layer">
          <DetailsList
            heading="Expenses"
            items={generateTransactionsDetailsItem('expenses')}
          />
        </div>
      </div>
    </div>
  );
};
