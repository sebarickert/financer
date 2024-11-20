'use client';

import clsx from 'clsx';
import { FC } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  TooltipProps,
  XAxis,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

type AreaStackedChartProps = {
  chartData: {
    dataKey: string;
    key1: { key: string; fill: string; value: number };
    key2: { key: string; fill: string; value: number };
  }[];
  colors: {
    key1: string;
    key2: string;
  };
  className?: string;
  yaxisTickFormatter?(value: unknown, index: number): string;
  xaxisTickFormatter?(value: unknown, index: number): string;
  customTooltip?(props: TooltipProps<ValueType, NameType>): JSX.Element;
};

export const AreaStackedChart: FC<AreaStackedChartProps> = ({
  chartData,
  colors,
  className,
  yaxisTickFormatter,
  xaxisTickFormatter,
  customTooltip,
}) => {
  const parsedChartData = chartData.map(({ dataKey, key1, key2 }) => ({
    dataKey,
    [key1.key]: key1.value,
    [key2.key]: key2.value,
  }));

  return (
    <div
      className={clsx(
        className,
        'aspect-video text-xs text-muted-foreground',
        '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
        '[&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-accent',
        '[&_.recharts-dot[stroke="#fff"]]:stroke-transparent',
      )}
    >
      <ResponsiveContainer>
        <AreaChart data={parsedChartData} margin={{}}>
          <defs>
            <linearGradient id="fillKey1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.key1} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.key1} stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillKey2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.key2} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors.key2} stopOpacity={0.1} />
            </linearGradient>
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
          <Area
            dataKey={chartData[0].key1.key}
            fill="url(#fillKey1)"
            fillOpacity={0.5}
            stroke={colors.key1}
          />
          <Area
            dataKey={chartData[0].key2.key}
            fill="url(#fillKey2)"
            fillOpacity={0.5}
            stroke={colors.key2}
          />
          <Tooltip cursor={false} content={customTooltip} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
