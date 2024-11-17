'use client';

import clsx from 'clsx';
import { FC } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { TransactionType } from '$api/generated/financerApi';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';

type AreaStackedChartProps = {
  // chartData: {
  //   key1: { key: string; fill: string; value: number };
  //   key2: { key: string; fill: string; value: number };
  // };
  // label: {
  //   main: string;
  //   sub: string;
  // };
  className?: string;
};

export const AreaStackedChart: FC<AreaStackedChartProps> = ({
  // chartData,
  // label,
  className,
}) => {
  // const parsedChartData = [
  //   {
  //     [chartData.key1.key]: chartData.key1.value,
  //     [chartData.key2.key]: chartData.key2.value,
  //   },
  // ];

  const pålaa = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  const color1 = transactionTypeThemeMapping[TransactionType.Expense]
    .hex as string;
  const color2 = transactionTypeThemeMapping[TransactionType.Income]
    .hex as string;

  return (
    <div className={clsx(className, 'aspect-video')}>
      <ResponsiveContainer>
        <AreaChart
          data={pålaa}
          margin={{
            left: -20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={3}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill={color1}
            fillOpacity={0.4}
            stroke={color1}
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill={color2}
            fillOpacity={0.4}
            stroke={color2}
            stackId="a"
          />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
