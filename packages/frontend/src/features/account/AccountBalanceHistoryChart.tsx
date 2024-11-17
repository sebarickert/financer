'use client';

import { ChartData, ChartOptions } from 'chart.js';
import { isAfter } from 'date-fns';
import { FC, useMemo } from 'react';

import {
  AccountDto,
  Theme,
  useAccountsGetAccountBalanceHistoryQuery,
} from '$api/generated/financerApi';
import { baseChartOptions } from '$constants/graph/graph.settings';
import { monthAgoDate } from '$constants/months';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { formatDate } from '$utils/formatDate';
import { setGradientLineGraphBackground } from '$utils/graph/setGradientLineGraphBackground';

type AccountBalanceHistory = {
  dateStr: string;
  date: Date;
  balance: number;
};

type AccountBalanceHistoryChartProps = {
  accountId: AccountDto['id'];
  userTheme: Theme;
};

export const AccountBalanceHistoryChart: FC<
  AccountBalanceHistoryChartProps
> = ({ accountId, userTheme }) => {
  const { data: accountBalanceHistoryData } =
    useAccountsGetAccountBalanceHistoryQuery({ id: accountId });

  const accountBalanceHistory: AccountBalanceHistory[] = useMemo(() => {
    if (!accountBalanceHistoryData) return [];

    return accountBalanceHistoryData
      .map(({ date, balance }) => ({
        date: new Date(date),
        balance,
        dateStr: formatDate(new Date(date)),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [accountBalanceHistoryData]);

  const monthAgoIndex = accountBalanceHistory.indexOf(
    accountBalanceHistory.find((tick) => isAfter(tick.date, monthAgoDate)) ||
      accountBalanceHistory[0],
  );

  const startIndex =
    accountBalanceHistory.length - monthAgoIndex > 12
      ? monthAgoIndex
      : accountBalanceHistory.length - 12;

  const labels = accountBalanceHistory.map(({ dateStr }) => {
    return dateStr;
  });

  const chartOptions = useMemo(() => {
    const customChartOptions = {
      ...baseChartOptions,
      scales: {
        ...baseChartOptions?.scales,
        x: {
          ...baseChartOptions?.scales?.x,
          min: startIndex,
          ticks: {
            ...baseChartOptions?.scales?.x?.ticks,
            callback: function (val, index, ticks) {
              if (ticks.length === 1) return null;

              if (ticks.length <= 3) return this.getLabelForValue(Number(val));

              if (index === 0 || ticks.length - 1 === index) return null;

              return this.getLabelForValue(Number(val));
            },
          },
        },
      },
    } as ChartOptions;

    return customChartOptions;
  }, [startIndex]);

  const chartData = useMemo(
    () =>
      ({
        labels,
        datasets: [
          {
            label: 'Balance',
            fill: true,
            borderColor: '#0f62fe',
            backgroundColor: setGradientLineGraphBackground,
            data: accountBalanceHistory.map(({ balance }) => balance),
            tension: 0.25,
          },
        ],
      }) as ChartData,
    [accountBalanceHistory, labels],
  );

  if (accountBalanceHistory.length < 3) {
    return null;
  }

  return (
    <ChartWrapperDynamic
      type="line"
      data={chartData}
      options={chartOptions}
      userTheme={userTheme}
    />
  );
};
