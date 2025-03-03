'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

import { ChartConfig } from '@/types/ChartConfig';
import { ChartData } from '@/types/ChartData';

interface RadialStackedChartProps {
  data: ChartData;
  config: ChartConfig;
  label: {
    primary: string;
    secondary: string;
  };
  className?: string;
}

export const RadialStackedChart: FC<RadialStackedChartProps> = ({
  data,
  config,
  className,
  label,
}) => {
  const chartId = `chart-${useId()}`;

  return (
    <div className={clsx(className, 'aspect-square')}>
      <style>{`
        [data-chart='${chartId}'] {
          ${Object.entries(config)
            .map(([key, { color }]) => `--color-${key}: ${color};`)
            .join('\n')}
        }
      `}</style>
      <ResponsiveContainer>
        <RadialBarChart
          data={data}
          endAngle={180}
          innerRadius={80}
          outerRadius={130}
        >
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) - 16}
                        className="text-lg font-bold fill-foreground"
                        data-testid="radial-stacked-chart-label-main"
                      >
                        {label.primary}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 4}
                        className="text-base fill-muted-foreground"
                        data-testid="radial-stacked-chart-label-sub"
                      >
                        {label.secondary}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          {Object.entries(config).map(([key, { color }]) => (
            <RadialBar key={key} dataKey={key} fill={color} stackId="a" />
          ))}
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};
