'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { CustomTooltip } from './CustomTooltip';

import { ChartConfig } from '@/types/ChartConfig';
import { ChartData } from '@/types/ChartData';

interface PieChartDonutProps {
  data: ChartData<{ value: number; fill: string }>;
  config: ChartConfig;
  className?: string;
}

export const PieChartDonut: FC<PieChartDonutProps> = ({
  data,
  config,
  className,
}) => {
  const chartId = `chart-${useId()}`;

  return (
    <div
      data-slot="chart"
      data-chart={chartId}
      className={clsx(
        className,
        'aspect-square ',
        '[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
        '[&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-accent',
        '[&_.recharts-dot[stroke="#fff"]]:stroke-transparent',
        '[&_.recharts-curve[stroke="#ccc"]]:stroke-accent',
        '[&_.recharts-sector[stroke="#fff"]]:stroke-transparent',
        '[&_.recharts-layer]:outline-hidden',
        '[&_.recharts-sector[stroke="#fff"]]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden',
      )}
    >
      <style>{`
        [data-chart='${chartId}'] {
          ${Object.entries(config)
            .map(([key, { color }]) => `--color-${key}: ${color};`)
            .join('\n')}
        }
      `}</style>
      <ResponsiveContainer>
        <PieChart
          data={data}
          endAngle={180}
          innerRadius={80}
          outerRadius={130}
          accessibilityLayer
        >
          <Tooltip content={<CustomTooltip config={config} hideLabel />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="dataKey"
            innerRadius={'35%'}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
