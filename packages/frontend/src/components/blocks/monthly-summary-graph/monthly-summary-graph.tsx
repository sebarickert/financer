import { ChartOptions } from 'chart.js';
import { useEffect, useState, useTransition } from 'react';
import { Chart } from 'react-chartjs-2';

import { colorPalette } from '../../../constants/colorPalette';
import { useExpenseMonthlySummaries } from '../../../hooks/expense/useExpenseMonthlySummaries';
import { useIncomeMonthlySummaries } from '../../../hooks/income/useIncomeMonthlySummaries';
import { useUserStatisticsSettings } from '../../../hooks/profile/user-preference/useStatisticsSettings';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDateShort } from '../../../utils/formatDate';
import { LoaderIfLoading } from '../../elements/loader/loader-if-processing';

interface BalanceGraphProps {
  className?: string;
}

const yearAgoFilterOptions = {
  year: new Date().getFullYear() - 1,
  month: new Date().getMonth(),
};

const getDateFromYearAndMonth = (year: number, month: number): Date =>
  new Date(`${year}-${month.toString().padStart(2, '0')}-01`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeDuplicatesFromArray = (array: any[]) => Array.from(new Set(array));

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
  const [isProcessing, startProcessing] = useTransition();
  const [monthlySummaryHistory, setMonthlySummaryHistory] = useState<
    MonthlySummaryHistory[]
  >([]);

  const [statisticsSettings] = useUserStatisticsSettings();
  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const incomeMonthSummaries = useIncomeMonthlySummaries({
    ...yearAgoFilterOptions,
    ...accountTypeFilter,
  });
  const expenseMonthSummaries = useExpenseMonthlySummaries({
    ...yearAgoFilterOptions,
    ...accountTypeFilter,
  });

  useEffect(() => {
    startProcessing(() => {
      const allMonths = removeDuplicatesFromArray(
        [...incomeMonthSummaries, ...expenseMonthSummaries].map(({ _id }) =>
          JSON.stringify(_id)
        )
      ).map((item) => JSON.parse(item));

      const monthlySummaryHistoryStack = allMonths
        .map(({ year: targetYear, month: targetMonth }) => {
          const incomeSummary = incomeMonthSummaries.find(
            ({ _id: { year, month } }) =>
              year === targetYear && month === targetMonth
          );
          const expenseSummary = expenseMonthSummaries.find(
            ({ _id: { year, month } }) =>
              year === targetYear && month === targetMonth
          );

          const incomes = incomeSummary?.totalAmount ?? 0;
          const expenses = expenseSummary?.totalAmount ?? 0;

          return {
            year: targetYear,
            month: targetMonth,
            date: getDateFromYearAndMonth(targetYear, targetMonth),
            incomes,
            expenses,
            netStatus: incomes - expenses,
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      setMonthlySummaryHistory(
        monthlySummaryHistoryStack.length > 12
          ? monthlySummaryHistoryStack.slice(-12)
          : monthlySummaryHistoryStack
      );
    });
  }, [expenseMonthSummaries, incomeMonthSummaries]);

  const labels = monthlySummaryHistory.map(({ date }) => formatDateShort(date));

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: -20,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          minRotation: 0,
          maxRotation: 0,
          callback: function (val, index, ticks) {
            if (ticks.length === 12) {
              return index % 3 === 1 ? this.getLabelForValue(Number(val)) : '';
            }

            return this.getLabelForValue(Number(val));
          },
          color: colorPalette.charcoal,
          font: {
            size: 13,
            family: 'Inter',
          },
        },
      },
      y: {
        max: 7500,
        grid: {
          drawBorder: false,
          color: colorPalette['gray-dark'],
        },
        ticks: {
          display: false,
          maxTicksLimit: 4,
        },
      },
      trendLine: {
        axis: 'y',
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        hitRadius: 32,
        radius: 0,
        hoverBorderWidth: 3,
        hoverRadius: 3,
        hoverBorderColor: colorPalette.blue,
        hoverBackgroundColor: colorPalette.blue,
      },
      line: {
        borderWidth: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      filler: {
        propagate: true,
      },
      tooltip: {
        backgroundColor: colorPalette.charcoal,
        padding: 16,
        mode: 'index',
        intersect: true,
        position: 'nearest',
        bodySpacing: 6,
        displayColors: false,
        titleFont: {
          size: 16,
          family: 'Inter',
          weight: '600',
        },
        bodyFont: {
          size: 16,
          family: 'Inter',
        },
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';

            if (!context.parsed.y) {
              return `${label} ${formatCurrency(0)}`;
            }

            return `${label} ${formatCurrency(context.parsed.y as number)}`;
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Incomes',
        backgroundColor: colorPalette.green,
        data: monthlySummaryHistory.map(({ incomes }) => incomes),
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Expenses',
        backgroundColor: colorPalette.red,
        data: monthlySummaryHistory.map(({ expenses }) => expenses),
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Net total',
        borderColor: colorPalette.blue,
        fill: {
          target: 'origin',
          above: `${colorPalette.blue}1A`,
          below: `${colorPalette.blue}1A`,
        },
        data: monthlySummaryHistory.map(({ netStatus }) => netStatus),
        yAxisID: 'trendLine',
      },
    ],
  };

  if (!monthlySummaryHistory?.length) return null;

  return (
    <section
      className={`min-h-[300px] h-[20vh] md:h-auto md:min-h-0 md:aspect-video max-md:-mx-4 ${className}`}
    >
      <LoaderIfLoading isLoading={isProcessing}>
        <Chart type="bar" data={data} options={options} />
      </LoaderIfLoading>
    </section>
  );
};
