import { AccountDto } from '@local/types';
import { ChartData } from 'chart.js';
import { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';

import { useAccountsGetAccountBalanceHistoryQuery } from '$api/generated/financerApi';
import { colorPalette } from '$constants/colorPalette';
import { baseChartOptions } from '$constants/graph/graph.settings';
import { MONTH_IN_MS } from '$constants/months';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { formatDate } from '$utils/formatDate';
import { setGradientLineGraphBackground } from '$utils/graph/setGradientLineGraphBackground';

interface AccountBalanceHistory {
  dateStr: string;
  date: Date;
  balance: number;
}

interface AccountBalanceHistoryChartProps {
  accountId: AccountDto['_id'];
}

const monthAgoDate = new Date().getTime() - MONTH_IN_MS;

export const AccountBalanceHistoryChart = ({
  accountId,
}: AccountBalanceHistoryChartProps): JSX.Element | null => {
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
    accountBalanceHistory.find((tick) => tick.date.getTime() > monthAgoDate) ||
      accountBalanceHistory[0]
  );

  const startIndex =
    accountBalanceHistory.length - monthAgoIndex > 12
      ? monthAgoIndex
      : accountBalanceHistory.length - 12;

  const labels = accountBalanceHistory.map(({ dateStr }) => {
    return dateStr;
  });

  const chartOptions = useMemo(() => {
    const customChartOptions = baseChartOptions;

    if (customChartOptions?.scales?.x) {
      customChartOptions.scales.x.min = startIndex;
    }

    if (customChartOptions?.scales?.x?.ticks) {
      customChartOptions.scales.x.ticks.callback = function (
        val,
        index,
        ticks
      ) {
        if (ticks.length === 1) return null;

        if (ticks.length <= 3) return this.getLabelForValue(Number(val));

        if (index === 0 || ticks.length - 1 === index) return null;

        return this.getLabelForValue(Number(val));
      };
    }

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
            borderColor: colorPalette.blue,
            backgroundColor: setGradientLineGraphBackground,
            data: accountBalanceHistory.map(({ balance }) => balance),
            tension: 0.25,
          },
        ],
      } as ChartData),
    [accountBalanceHistory, labels]
  );

  if (!accountBalanceHistory?.length) {
    return null;
  }

  return (
    <ChartWrapperDynamic>
      <Chart type="line" data={chartData} options={chartOptions} />
    </ChartWrapperDynamic>
  );
};
