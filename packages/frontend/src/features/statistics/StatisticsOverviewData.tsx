'use client';

import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';
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
                    className={clsx('inline-block w-2.5 h-2.5 rounded-sm', {
                      'bg-green': entry.dataKey === 'incomes',
                      'bg-red': entry.dataKey === 'expenses',
                    })}
                  />
                  {entry.dataKey === 'incomes' ? 'Incomes' : 'Expenses'}
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

export const StatisticsOverviewData: FC<StatisticsOverviewDataProps> = ({
  data,
}) => {
  const chartData = useMemo(
    () =>
      data.map(({ date, incomeAmount, expenseAmount }) => ({
        dataKey: formatDate(date, DateFormat.monthShort),
        data: [
          {
            key: 'incomes',
            color: 'hsl(var(--color-green))',
            value: incomeAmount,
          },
          {
            key: 'expenses',
            color: 'hsl(var(--color-red))',
            value: expenseAmount,
          },
        ],
      })),
    [data],
  );

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

  const { incomes, expenses } = filteredChartData.reduce(
    (acc, month) => {
      month.data.forEach((entry) => {
        if (entry.key === 'incomes') {
          acc.incomes.push(entry.value);
        } else if (entry.key === 'expenses') {
          acc.expenses.push(entry.value);
        }
      });
      return acc;
    },
    { incomes: [] as number[], expenses: [] as number[] },
  );

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
          yaxisTickFormatter={(value: number) => {
            return formatCurrencyAbbreviation(value);
          }}
          customTooltip={CustomTooltip}
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
