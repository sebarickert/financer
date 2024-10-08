'use client';

import { ChartData, ChartOptions } from 'chart.js';
import { useMemo } from 'react';

import { useTransactionsFindMonthlySummariesByUserQuery } from '$api/generated/financerApi';
import { colorPalette } from '$constants/colorPalette';
import { baseChartOptions } from '$constants/graph/graph.settings';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { useUserStatisticsSettings } from '$hooks/settings/user-preference/useStatisticsSettings';
import { formatCurrency } from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';
import { generateDateFromYearAndMonth } from '$utils/generateDateFromYearAndMonth';
import { setGradientLineGraphBackground } from '$utils/graph/setGradientLineGraphBackground';

interface BalanceGraphProps {
  className?: string;
}

const yearAgoFilterOptions = {
  year: new Date().getFullYear() - 1,
  month: new Date().getMonth(),
};

type MonthlySummaryHistory = {
  year: number;
  month: number;
  date: Date;
  incomes: number;
  expenses: number;
  netStatus: number;
};

export const MonthlySummaryGraph = ({
  className = '',
}: BalanceGraphProps): JSX.Element | null => {
  const { data: statisticsSettings } = useUserStatisticsSettings();

  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const { data: transactionMonthSummaries } =
    useTransactionsFindMonthlySummariesByUserQuery({
      ...yearAgoFilterOptions,
      ...accountTypeFilter,
    });

  const monthlySummaryHistory: MonthlySummaryHistory[] = useMemo(() => {
    if (!transactionMonthSummaries) return [];

    const monthlySummaryHistoryStack = transactionMonthSummaries
      .map(
        ({
          id: { year: targetYear, month: targetMonth },
          expenseAmount = 0,
          incomeAmount = 0,
          totalAmount = 0,
        }) => {
          return {
            year: targetYear,
            month: targetMonth,
            date: generateDateFromYearAndMonth(targetYear, targetMonth),
            incomes: incomeAmount,
            expenses: expenseAmount,
            netStatus: totalAmount,
          };
        },
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return monthlySummaryHistoryStack.length > 12
      ? monthlySummaryHistoryStack.slice(-12)
      : monthlySummaryHistoryStack;
  }, [transactionMonthSummaries]);

  const labels = monthlySummaryHistory.map(({ date }) =>
    formatDate(date, DateFormat.monthShort).toUpperCase(),
  );

  const chartOptions = useMemo(() => {
    const customChartOptions = {
      ...baseChartOptions,
      scales: {
        ...baseChartOptions?.scales,
        y: {
          ...baseChartOptions?.scales?.y,
          max: 15000,
        },
        x: {
          ...baseChartOptions?.scales?.x,
          ticks: {
            ...baseChartOptions?.scales?.x?.ticks,
            callback: function (val, index, ticks) {
              if (ticks.length === 1) return null;

              if (ticks.length <= 3) return this.getLabelForValue(Number(val));

              if (index === 0 || ticks.length - 1 === index) return null;

              if (ticks.length === 4) {
                return this.getLabelForValue(Number(val));
              }

              if (ticks.length % 3 === 0) {
                return index % 3 === 1
                  ? this.getLabelForValue(Number(val))
                  : null;
              }

              return index % 2 === 1
                ? this.getLabelForValue(Number(val))
                : null;
            },
          },
        },
      },
      plugins: {
        ...baseChartOptions?.plugins,
        tooltip: {
          ...baseChartOptions?.plugins?.tooltip,
          callbacks: {
            ...baseChartOptions?.plugins?.tooltip?.callbacks,
            title(tooltipItem) {
              const label = tooltipItem[0].label;
              const incomeValue = tooltipItem[0].parsed.y;
              const expenseValue = tooltipItem[1].parsed.y;

              const value = formatCurrency(incomeValue - expenseValue, true);

              return `${label} (${value})`;
            },
          },
        },
      },
    } as ChartOptions;

    return customChartOptions;
  }, []);

  const chartData = useMemo(
    () =>
      ({
        labels,
        datasets: [
          {
            label: 'Incomes',
            fill: true,
            borderColor: colorPalette.green,
            backgroundColor: setGradientLineGraphBackground,
            data: monthlySummaryHistory.map(({ incomes }) => incomes),
            tension: 0.25,
          },
          {
            label: 'Expenses',
            fill: true,
            borderColor: colorPalette.red,
            backgroundColor: setGradientLineGraphBackground,
            data: monthlySummaryHistory.map(({ expenses }) => expenses),
            tension: 0.25,
          },
        ],
      }) as ChartData,
    [labels, monthlySummaryHistory],
  );

  if (monthlySummaryHistory.length === 1) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <ChartWrapperDynamic
        isLoading={!monthlySummaryHistory?.length}
        type="line"
        data={chartData}
        options={chartOptions}
      />
    </section>
  );
};
