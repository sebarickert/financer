'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';
import {
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
  Area,
} from 'recharts';

import { CustomTooltip } from './CustomTooltip';

import { ChartConfig } from '$types/ChartConfig';
import { ChartData } from '$types/ChartData';

type AreaStackedChartProps = {
  data: ChartData;
  config: ChartConfig;
  className?: string;
  yaxisTickFormatter?(value: unknown, index: number): string;
  xaxisTickFormatter?(value: unknown, index: number): string;
};

export const AreaStackedChart: FC<AreaStackedChartProps> = ({
  data,
  config,
  className,
  yaxisTickFormatter,
  xaxisTickFormatter,
}) => {
  const chartId = `chart-${useId()}`;

  return (
    <div
      data-chart={chartId}
      data-slot="chart"
      className={clsx(
        className,
        'aspect-video text-xs text-muted-foreground',
        '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
        '[&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-accent',
        '[&_.recharts-dot[stroke="#fff"]]:stroke-transparent',
        '[&_.recharts-curve[stroke="#ccc"]]:stroke-accent',
        '[&_.recharts-sector[stroke="#fff"]]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none',
      )}
    >
      <style jsx>{`
        [data-chart='${chartId}'] {
          ${Object.entries(config)
            .map(([key, { color }]) => `--color-${key}: ${color};`)
            .join('\n')}
        }
      `}</style>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
          accessibilityLayer
        >
          <defs>
            {Object.entries(config).map(([key, { color }]) => (
              <linearGradient
                id={`fill${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
                key={key}
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            mirror
            tickFormatter={yaxisTickFormatter}
          />
          <XAxis
            dataKey={'dataKey'}
            tickLine={false}
            axisLine={false}
            tickFormatter={xaxisTickFormatter}
            mirror
          />
          {Object.entries(config).map(([key, { color }]) => (
            <Area
              key={key}
              dataKey={key}
              fill={`url(#fill${key})`}
              stroke={color}
            />
          ))}
          <Tooltip content={<CustomTooltip config={config} />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
