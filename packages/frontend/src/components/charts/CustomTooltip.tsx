import clsx from 'clsx';
import { FC } from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { ChartConfig } from './AreaStackedChart';

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  chartConfig: ChartConfig;
};

export const CustomTooltip: FC<CustomTooltipProps> = ({
  active,
  payload,
  chartConfig,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="grid gap-1 p-2 text-xs border rounded-md bg-layer">
        <p className="font-medium text-foreground">
          {payload[0].payload.dataKey}
        </p>
        <ul className="space-y-1">
          {Object.entries(chartConfig).map(
            ([key, { label, valueFormatter }]) => {
              const tooltipStyle = {
                '--color-bg': `var(--color-${key})`,
              } as React.CSSProperties;

              const value = payload.find(
                (entry) => entry.dataKey === key,
              )?.value;

              return (
                <li key={key}>
                  <p className="grid grid-cols-[auto,1fr] gap-4 items-center">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <span
                        style={tooltipStyle}
                        className={clsx(
                          `inline-block w-2.5 h-2.5 rounded-sm bg-[--color-bg]`,
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
            },
          )}
        </ul>
      </div>
    );
  }

  return <div />;
};
