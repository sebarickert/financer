'use client';

import clsx from 'clsx';
import { FC } from 'react';
import {
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  TooltipProps,
  XAxis,
  Area,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

type AreaStackedChartProps = {
  chartData: {
    dataKey: string;
    data: { key: string; color: string; value: number }[];
  }[];
  className?: string;
  yaxisTickFormatter?(value: unknown, index: number): string;
  xaxisTickFormatter?(value: unknown, index: number): string;
  customTooltip?(props: TooltipProps<ValueType, NameType>): JSX.Element;
};

export const AreaStackedChart: FC<AreaStackedChartProps> = ({
  chartData,
  className,
  yaxisTickFormatter,
  xaxisTickFormatter,
  customTooltip,
}) => {
  const parsedChartData = chartData.map(({ dataKey, data }) => ({
    dataKey,
    ...data.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}),
  }));

  return (
    <div
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
      <ResponsiveContainer>
        <AreaChart data={parsedChartData} margin={{}} accessibilityLayer>
          <defs>
            {chartData[0].data.map(({ key, color }) => (
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
          {chartData[0].data.map(({ key, color }) => (
            <Area
              key={key}
              dataKey={key}
              fill={`url(#fill${key})`}
              stroke={color}
            />
          ))}
          <Tooltip content={customTooltip} active />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
