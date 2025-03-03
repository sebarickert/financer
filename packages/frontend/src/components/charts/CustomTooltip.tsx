/* eslint-disable @typescript-eslint/no-unsafe-member-access */
'use client';

import clsx from 'clsx';
import { FC } from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { ChartConfig } from '@/types/ChartConfig';

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  config: ChartConfig;
  hideLabel?: boolean;
};

export const CustomTooltip: FC<CustomTooltipProps> = ({
  active,
  payload,
  config,
  hideLabel,
}) => {
  if (active && payload?.length) {
    return (
      <div className="grid gap-1 p-2 text-xs border rounded-md bg-layer">
        {!hideLabel && (
          <p className="font-medium text-foreground">
            {payload[0].payload.dataKey}
          </p>
        )}
        <ul className="space-y-1">
          {payload.map(({ value, name }) => {
            const { label, valueFormatter } = config[name as string] ?? {};
            const tooltipStyle = {
              '--color-bg': `var(--color-${name})`,
            } as React.CSSProperties;

            return (
              <li key={name}>
                <p className="grid grid-cols-[auto_1fr] gap-4 items-center">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <span
                      style={tooltipStyle}
                      className={clsx(
                        `inline-block w-2.5 h-2.5 rounded-xs bg-(--color-bg)`,
                      )}
                    />
                    {label}
                  </span>
                  <span className="font-medium text-right text-foreground">
                    {valueFormatter ? valueFormatter(value) : value}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return <div />;
};
