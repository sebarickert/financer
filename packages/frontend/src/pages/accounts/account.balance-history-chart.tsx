import { AccountDto } from '@local/types';
import { ChartOptions } from 'chart.js';
import { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';

import { useAccountsGetAccountBalanceHistoryQuery } from '$api/generated/financerApi';
import { colorPalette } from '$constants/colorPalette';
import { MONTH_IN_MS } from '$constants/months';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';

interface IChartData {
  dateStr: string;
  date: Date;
  balance: number;
}

interface IAccountBalanceHistoryChartProps {
  accountId: AccountDto['_id'];
}

export const AccountBalanceHistoryChart = ({
  accountId,
}: IAccountBalanceHistoryChartProps): JSX.Element | null => {
  const { data: accountBalanceHistory } =
    useAccountsGetAccountBalanceHistoryQuery({ id: accountId });

  const monthAgoDate = new Date().getTime() - MONTH_IN_MS;

  const chartData: IChartData[] = useMemo(() => {
    if (!accountBalanceHistory) return [];

    return accountBalanceHistory
      .map(({ date, balance }) => ({
        date: new Date(date),
        balance,
        dateStr: formatDate(new Date(date)),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [accountBalanceHistory]);

  const monthAgoIndex = chartData.indexOf(
    chartData.find((tick) => tick.date.getTime() > monthAgoDate) || chartData[0]
  );

  const startIndex =
    chartData.length - monthAgoIndex > 12
      ? monthAgoIndex
      : chartData.length - 12;

  const labels = chartData.map(({ dateStr }) => {
    return dateStr;
  });

  const options: ChartOptions = {
    animation: false,
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
      padding: {
        right: -10,
      },
    },
    scales: {
      x: {
        min: startIndex,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          padding: 0,
          maxRotation: 0,
          callback: function (val, index, ticks) {
            if (ticks.length === 1) return null;

            if (ticks.length <= 3) return this.getLabelForValue(Number(val));

            if (index === 0 || ticks.length - 1 === index) return null;

            return this.getLabelForValue(Number(val));
          },
          color: colorPalette.charcoal,
          font: {
            size: 13,
            family: 'Inter',
            lineHeight: 1.5,
          },
        },
      },
      y: {
        position: 'right',
        grid: {
          color: colorPalette['gray-dark'],
          drawBorder: false,
        },
        ticks: {
          mirror: true,
          padding: 0,
          callback: function (val, index, ticks) {
            if (index % 2 === 0 || ticks.length - 1 === index) return null;

            return `${formatCurrencyAbbreviation(Number(val))} `;
          },
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
              return label;
            }

            return `${label} ${formatCurrency(context.parsed.y as number)}`;
          },
        },
      },
      zoom: {
        limits: {
          x: { minRange: 5 },
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.5,
          },
          drag: {
            enabled: true,
            modifierKey: 'ctrl',
            backgroundColor: `${colorPalette.blue}1A`,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        borderColor: colorPalette.blue,
        fill: {
          target: 'origin',
          above: `${colorPalette.blue}1A`,
          below: `${colorPalette.blue}1A`,
        },
        data: chartData.map(({ balance }) => balance),
      },
    ],
  };

  if (!chartData?.length) {
    return null;
  }

  return (
    <div className="min-h-[300px] h-[20vh] md:h-auto md:min-h-0 md:aspect-video -mx-4 md:-mx-0">
      <ChartWrapperDynamic>
        <Chart type="line" data={data} options={options} />
      </ChartWrapperDynamic>
    </div>
  );
};
