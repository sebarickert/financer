'use client';

import { ChartData, ChartOptions } from 'chart.js';
import { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';

import { useTransactionsFindMonthlySummariesByUserQuery } from '$api/generated/financerApi';
import { colorPalette } from '$constants/colorPalette';
import { baseChartOptions } from '$constants/graph/graph.settings';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { useUserDashboardSettings } from '$hooks/settings/user-preference/useDashboardSettings';
import { useGetLatestTransaction } from '$hooks/transaction/useGetLatestTransaction';
import { useGetTotalBalance } from '$hooks/useGetTotalBalance';
import { formatCurrency } from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';
import { generateDateFromYearAndMonth } from '$utils/generateDateFromYearAndMonth';
import { setGradientLineGraphBackground } from '$utils/graph/setGradientLineGraphBackground';

export type BalanceHistory = {
  date: Date;
  balance: number;
};

const yearAgo = new Date();
yearAgo.setFullYear(yearAgo.getFullYear() - 1);

const yearAgoFilterOptions = {
  year: yearAgo.getFullYear(),
  month: new Date().getMonth(),
};

const dummyGraphData = {
  labels: [formatDate(yearAgo, DateFormat.monthShort).toUpperCase(), 'CURRENT'],
  datasets: [
    {
      label: 'Balance',
      fill: true,
      borderColor: colorPalette.blue,
      backgroundColor: setGradientLineGraphBackground,
      data: [0, 10],
      tension: 0.25,
    },
  ],
};

export const BalanceGraph = (): JSX.Element | null => {
  const { data: dashboardSettings } = useUserDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const { data: totalBalance } = useGetTotalBalance(accountTypeFilter);
  const { data: latestTransaction } = useGetLatestTransaction();

  const { currentData: transactionMonthSummary } =
    useTransactionsFindMonthlySummariesByUserQuery({
      ...yearAgoFilterOptions,
      ...accountTypeFilter,
    });

  const balanceHistory: BalanceHistory[] = useMemo(() => {
    if (!transactionMonthSummary || !latestTransaction) {
      return [];
    }

    const latestTransactionTimestamp = new Date(
      latestTransaction?.date ?? new Date(),
    );

    const newBalanceHistory = transactionMonthSummary
      .map(({ id: { month, year }, totalAmount }) => ({
        date: generateDateFromYearAndMonth(year, month),
        amount: totalAmount,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .reduce(
        (previousBalance, { date, amount }) => {
          const { balance: latestBalance } = previousBalance[0];
          const currentBalance = { date, balance: latestBalance - amount };
          return [currentBalance, ...previousBalance];
        },
        [{ date: latestTransactionTimestamp, balance: totalBalance }],
      );

    return newBalanceHistory.length > 12
      ? newBalanceHistory.slice(-12)
      : newBalanceHistory;
  }, [transactionMonthSummary, latestTransaction, totalBalance]);

  const labels = balanceHistory.map(({ date }, index) => {
    if (balanceHistory.length - 1 === index) {
      return 'CURRENT';
    }

    return formatDate(date, DateFormat.monthShort).toUpperCase();
  });

  const chartOptions = useMemo(() => {
    const customChartOptions = {
      ...baseChartOptions,
      scales: {
        ...baseChartOptions?.scales,
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
            title([{ ...item }]) {
              const { label, dataIndex: index } = item;

              const currentBalance = item.parsed.y;
              const previousMonthBalance = item.dataset.data[index - 1] as
                | number
                | undefined;

              if (!previousMonthBalance) return label;

              const value = formatCurrency(
                currentBalance - previousMonthBalance,
                true,
              );

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
            label: 'Balance',
            fill: true,
            borderColor: colorPalette.blue,
            backgroundColor: setGradientLineGraphBackground,
            data: balanceHistory.map(({ balance }) => balance),
            tension: 0.25,
          },
        ],
      }) as ChartData,
    [balanceHistory, labels],
  );

  if (balanceHistory.length === 1) {
    return null;
  }

  return (
    <ChartWrapperDynamic isLoading={!balanceHistory?.length}>
      <Chart
        type="line"
        data={!balanceHistory?.length ? dummyGraphData : chartData}
        options={chartOptions}
      />
    </ChartWrapperDynamic>
  );
};
