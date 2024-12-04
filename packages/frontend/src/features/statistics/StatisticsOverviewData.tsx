'use client';

import { parse } from 'date-fns';
import { ArrowDown, ArrowUp, ChartLine, Divide, Equal } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

import { TransactionMonthSummaryDto } from '$api/generated/financerApi';
import { DetailsItem, DetailsList } from '$blocks/DetailsList';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { AreaStackedChart } from '$charts/AreaStackedChart';
import {
  ChartFilterByMonthsSelect,
  monthFilterOptions,
} from '$charts/ChartFilterByMonthsSelect';
import { ChartConfig } from '$types/ChartConfig';
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
      <InfoMessageBlock title="Not Enough Data Yet" Icon={ChartLine}>
        It seems there isn&apos;t enough data to generate a meaningful summary.
        Start by adding more transactions to see an overview of your monthly
        activity.
      </InfoMessageBlock>
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
        Icon: Divide,
        label: 'Average',
        description: formatCurrency(average[type]) ?? '-',
      },
      {
        Icon: ArrowUp,
        label: 'Highest',
        description: formatCurrency(highest[type]) ?? '-',
      },
      {
        Icon: ArrowDown,
        label: 'Lowest',
        description: formatCurrency(lowest[type]) ?? '-',
      },
    ];
  };

  const sumArray = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

  const summaryDetails: DetailsItem[] = [
    {
      Icon: Equal,
      label: 'Balance',
      description:
        formatCurrency(sumArray(incomes) - sumArray(expenses)) ?? '-',
    },
    {
      Icon: ArrowUp,
      label: 'Best Month',
      description: formatCurrency(Math.max(...summaries)) ?? '-',
    },
    {
      Icon: ArrowDown,
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
          data={filteredChartData}
          config={chartConfig}
          yaxisTickFormatter={(value: number) => {
            return formatCurrencyAbbreviation(value);
          }}
          xaxisTickFormatter={(value: string) => {
            const parsedDate = parse(value, DateFormat.monthLong, new Date());
            return formatDate(parsedDate, DateFormat.month);
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
