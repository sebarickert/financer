'use client';

import { FC } from 'react';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import { TransactionMonthSummaryDto } from '$api/generated/financerApi';
import { AreaStackedChart } from '$blocks/AreaStackedChart';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import {
  formatCurrency,
  formatCurrencyAbbreviation,
} from '$utils/formatCurrency';
import { DateFormat, formatDate } from '$utils/formatDate';

type StatisticsOverviewDataProps = {
  data: (Omit<TransactionMonthSummaryDto, 'id'> & { date: Date })[];
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 text-sm rounded-md theme-layer-color theme-text-primary">
        <p className="mb-2 font-medium">{payload[0].payload.dataKey}</p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="grid gap-4 grid-cols-[1fr,auto] uppercase"
          >
            <span>{entry.dataKey}</span>
            <span className="text-right">
              {formatCurrency(entry.value as number)}
            </span>
          </p>
        ))}
      </div>
    );
  }

  return <div />;
};

const yaxisTickFormatter = (value: number) => {
  return formatCurrencyAbbreviation(value);
};

export const StatisticsOverviewData: FC<StatisticsOverviewDataProps> = ({
  data,
}) => {
  const chartData = data.map(({ date, incomeAmount, expenseAmount }) => ({
    dataKey: formatDate(date, DateFormat.monthShort),
    key1: {
      key: 'incomes',
      fill: '#198038',
      value: incomeAmount,
    },
    key2: {
      key: 'expenses',
      fill: '#da1e28',
      value: expenseAmount,
    },
  }));

  if (chartData.length < 3) {
    return (
      <EmptyContentBlock title="Not Enough Data Yet" icon="RectangleGroupIcon">
        It seems there isn&apos;t enough data to generate a meaningful summary.
        Start by adding more transactions to see an overview of your monthly
        activity.
      </EmptyContentBlock>
    );
  }

  return (
    <AreaStackedChart
      chartData={chartData.slice(-12)}
      colors={{ key1: '#198038', key2: '#da1e28' }}
      yaxisTickFormatter={yaxisTickFormatter}
      customTooltip={CustomTooltip}
    />
  );
};
