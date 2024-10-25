'use client';

import { ChartData, ChartOptions } from 'chart.js';
import { FC, useMemo } from 'react';

import { baseChartOptions } from '$constants/graph/graph.settings';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { formatCurrency } from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';
import { setGradientLineGraphBackground } from '$utils/graph/setGradientLineGraphBackground';

export type BalanceHistory = {
  date: Date;
  balance: number;
};

const chartOptions: ChartOptions = {
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
            return index % 3 === 1 ? this.getLabelForValue(Number(val)) : null;
          }

          return index % 2 === 1 ? this.getLabelForValue(Number(val)) : null;
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
};

type BalanceGraphChartProps = {
  balanceHistory: BalanceHistory[];
};

export const BalanceGraphChart: FC<BalanceGraphChartProps> = ({
  balanceHistory,
}) => {
  const chartData: ChartData = useMemo(
    () => ({
      labels: balanceHistory.map(({ date }, index) => {
        if (balanceHistory.length - 1 === index) {
          return 'CURRENT';
        }

        return formatDate(date, DateFormat.monthShort).toUpperCase();
      }),
      datasets: [
        {
          label: 'Balance',
          fill: true,
          borderColor: '#0f62fe',
          backgroundColor: setGradientLineGraphBackground,
          data: balanceHistory.map(({ balance }) => balance),
          tension: 0.25,
        },
      ],
    }),
    [balanceHistory],
  );

  if (balanceHistory.length === 1) {
    return null;
  }

  return (
    <ChartWrapperDynamic
      isLoading={!balanceHistory?.length}
      type="line"
      data={chartData}
      options={chartOptions}
    />
  );
};
