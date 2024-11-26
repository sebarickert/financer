'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { AccountBalanceHistoryDto } from '$api/generated/financerApi';
import { AreaStackedChart } from '$charts/AreaStackedChart';
import { DateFormat, formatDate } from '$utils/formatDate';

type AccountBalanceHistoryChartProps = {
  data: AccountBalanceHistoryDto[];
  className?: string;
};

export const AccountBalanceHistoryChart: FC<
  AccountBalanceHistoryChartProps
> = ({ data, className }) => {
  const chartData = data.map(({ date, balance }) => ({
    dataKey: formatDate(new Date(date), DateFormat.monthShort),
    data: [
      {
        key: 'balance',
        color: 'hsl(var(--color-blue))',
        value: balance,
      },
    ],
  }));

  return (
    <div className={clsx(className, 'bg-layer rounded-md overflow-hidden')}>
      {/* <div className="grid justify-end gap-2 p-4 lg:p-6">
        <select
          className={clsx(
            'theme-field-inverse',
            'block rounded-md',
            'py-3 h-12',
          )}
          defaultValue={selectedFilter}
          onChange={handleChange}
        >
          {filteredOptions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div> */}
      <AreaStackedChart
        chartData={chartData}
        // yaxisTickFormatter={yaxisTickFormatter}
        // customTooltip={CustomTooltip}
      />
    </div>
  );
};
