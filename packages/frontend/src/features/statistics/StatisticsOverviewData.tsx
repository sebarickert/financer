'use client';

import { ChartLine, Equal, LineChart, Percent, PieChart } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

import { TransactionMonthSummaryDto } from '$api/generated/financerApi';
import { DetailsItem, DetailsList } from '$blocks/DetailsList';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { AreaStackedChart } from '$charts/AreaStackedChart';
import {
  ChartFilterByMonthsSelect,
  monthFilterOptions,
} from '$charts/ChartFilterByMonthsSelect';
import { settingsPaths } from '$constants/settingsPaths';
import { Link } from '$elements/Link';
import { DATE_FORMAT, DateService } from '$services/DateService';
import { ChartConfig } from '$types/ChartConfig';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '$utils/formatCurrency';

type StatisticsOverviewDataProps = {
  data: (Omit<TransactionMonthSummaryDto, 'id'> & { date: string })[];
};

export const StatisticsOverviewData: FC<StatisticsOverviewDataProps> = ({
  data,
}) => {
  const chartData = useMemo(
    () =>
      data.map(({ date, incomeAmount, expenseAmount }) => ({
        dataKey: new DateService(date).format(DATE_FORMAT.MONTH_LONG),
        incomes: incomeAmount,
        expenses: expenseAmount,
      })),
    [data],
  );

  const chartConfig = {
    incomes: {
      label: 'Incomes',
      color: 'var(--color-green)',
      valueFormatter: formatCurrency,
    },
    expenses: {
      label: 'Expenses',
      color: 'var(--color-red)',
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

  const sumArray = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

  const generateTransactionsDetailsItem = (
    type: 'incomes' | 'expenses',
  ): DetailsItem[] => {
    return [
      {
        Icon: LineChart,
        label: 'Average',
        description: formatCurrency(average[type]) ?? '-',
      },
      {
        Icon: PieChart,
        label: 'Total',
        description:
          formatCurrency(sumArray(type === 'incomes' ? incomes : expenses)) ??
          '-',
      },
    ];
  };

  const summaryDetails: DetailsItem[] = [
    {
      Icon: Equal,
      label: 'Balance',
      description:
        formatCurrency(sumArray(incomes) - sumArray(expenses)) ?? '-',
    },
    {
      Icon: Percent,
      label: 'Savings Rate',
      description: `${(
        ((sumArray(incomes) - sumArray(expenses)) / sumArray(incomes)) *
        100
      ).toFixed(2)}%`,
    },
  ];

  return (
    <>
      <InfoMessageBlock
        title="Monthly Summaries"
        className="mb-6"
        variant="barebone"
      >
        View monthly income and expense summaries, along with calculations based
        on the account types you&apos;ve selected in your{' '}
        <Link className="underline" href={settingsPaths.userPreferences}>
          preferences
        </Link>
        .
      </InfoMessageBlock>
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
            xaxisTickFormatter={(value: string) =>
              DateService.parseFormat(value, DATE_FORMAT.MONTH_LONG).toFormat(
                DATE_FORMAT.MONTH,
              )
            }
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
    </>
  );
};
