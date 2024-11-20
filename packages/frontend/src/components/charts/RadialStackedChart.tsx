'use client';

import clsx from 'clsx';
import { FC } from 'react';
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';

type RadialStackedChartProps = {
  chartData: {
    key1: { key: string; fill: string; value: number };
    key2: { key: string; fill: string; value: number };
  };
  label: {
    main: string;
    sub: string;
  };
  className?: string;
};

export const RadialStackedChart: FC<RadialStackedChartProps> = ({
  chartData,
  label,
  className,
}) => {
  const parsedChartData = [
    {
      [chartData.key1.key]: chartData.key1.value,
      [chartData.key2.key]: chartData.key2.value,
    },
  ];

  return (
    <div className={clsx(className, 'aspect-square')}>
      <ResponsiveContainer>
        <RadialBarChart
          data={parsedChartData}
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
                        y={(viewBox.cy || 0) - 16}
                        className="text-lg font-bold fill-foreground"
                        data-testid="radial-stacked-chart-label-main"
                      >
                        {label.main}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="text-base fill-muted-foreground"
                        data-testid="radial-stacked-chart-label-sub"
                      >
                        {label.sub}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey={chartData.key1.key}
            fill={chartData.key1.fill}
            stackId="a"
          />
          <RadialBar
            dataKey={chartData.key2.key}
            fill={chartData.key2.fill}
            stackId="a"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};
