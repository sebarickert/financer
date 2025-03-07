'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { AccountType, SchemaAccountDto } from '@/api/ssr-financer-api';
import { Card } from '@/blocks/Card/Card';
import { DetailsItem, DetailsList } from '@/blocks/DetailsList';
import { PieChartDonut } from '@/charts/PieChartDonut';
import { ACCOUNT_TYPE_MAPPING } from '@/constants/account/ACCOUNT_TYPE_MAPPING';
import { ChartConfig } from '@/types/ChartConfig';
import { ChartData } from '@/types/ChartData';
import { formatCurrency } from '@/utils/formatCurrency';

interface AccountTypeBalanceChartProps {
  data: SchemaAccountDto[];
  className?: string;
}

const ALLOWED_ACCOUNT_TYPES = [
  AccountType.SAVINGS,
  AccountType.CASH,
  AccountType.LONG_TERM_SAVINGS,
  AccountType.PRE_ASSIGNED_CASH,
  AccountType.INVESTMENT,
];

export const AccountTypeBalanceChart: FC<AccountTypeBalanceChartProps> = ({
  data,
  className,
}) => {
  const accounts = data.filter(({ type }) =>
    ALLOWED_ACCOUNT_TYPES.includes(type),
  );

  const accountTypeBalances = Object.fromEntries(
    Object.entries(Object.groupBy(accounts, ({ type }) => type)).map(
      ([key, value]) => [
        key as AccountType,
        value
          .map(
            ({ balance, currentDateBalance }) => currentDateBalance ?? balance,
          )
          .reduce((acc, curr) => acc + curr, 0),
      ],
    ),
  );

  const totalBalance = Object.values(accountTypeBalances).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  const chartData = Object.entries(accountTypeBalances).map(([key, value]) => {
    return {
      dataKey: key,
      value,
      fill: `var(--color-${key})`,
    };
  }) satisfies ChartData<{
    value: number;
    fill: string;
  }>;

  const calculateBalancePercentage = (value: number) => {
    const percentage = (value / totalBalance) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  const chartConfig = {
    [AccountType.SAVINGS]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.SAVINGS].label,
      color: 'var(--account-SAVINGS)',
      valueFormatter: (value) => calculateBalancePercentage(value as number),
    },
    [AccountType.CASH]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.CASH].label,
      color: 'var(--account-CASH)',
      valueFormatter: (value) => calculateBalancePercentage(value as number),
    },
    [AccountType.LONG_TERM_SAVINGS]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.LONG_TERM_SAVINGS].label,
      color: 'var(--account-LONG-TERM-SAVINGS)',
      valueFormatter: (value) => calculateBalancePercentage(value as number),
    },
    [AccountType.PRE_ASSIGNED_CASH]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.PRE_ASSIGNED_CASH].label,
      color: 'var(--account-PRE-ASSIGNED-CASH)',
      valueFormatter: (value) => calculateBalancePercentage(value as number),
    },
    [AccountType.INVESTMENT]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.INVESTMENT].label,
      color: 'var(--account-INVESTMENT)',
      valueFormatter: (value) => calculateBalancePercentage(value as number),
    },
  } satisfies ChartConfig;

  const accountDetails: DetailsItem[] = Object.entries(accountTypeBalances)
    .filter(([, balance]) => balance > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([key, balance]) => {
      return {
        Icon: ACCOUNT_TYPE_MAPPING[key as AccountType].Icon,
        label: ACCOUNT_TYPE_MAPPING[key as AccountType].label,
        description: formatCurrency(balance),
      };
    });

  if (chartData.length === 0 || accountDetails.length === 0) {
    return null;
  }

  return (
    <Card className={clsx(className, '@container')}>
      <div className="grid @[645px]:grid-cols-[300px_1fr] lg:@[645px]:grid-cols-[350px_1fr] @[645px]:gap-4 items-center">
        <PieChartDonut
          config={chartConfig}
          data={chartData}
          className={clsx(
            '@max-w-[645px]:max-w-[300px] w-full place-self-center -mt-8',
            '@[645px]:-my-6',
          )}
        />
        <DetailsList items={accountDetails} />
      </div>
    </Card>
  );
};
