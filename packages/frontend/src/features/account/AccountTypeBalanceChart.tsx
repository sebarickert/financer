'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { AccountDto, AccountType } from '$api/generated/financerApi';
import { Card } from '$blocks/Card/Card';
import { DetailsItem, DetailsList } from '$blocks/DetailsList';
import { PieChartDonut } from '$charts/PieChartDonut';
import { ACCOUNT_TYPE_MAPPING } from '$constants/account/ACCOUNT_TYPE_MAPPING';
import { ChartConfig } from '$types/ChartConfig';
import { ChartData } from '$types/ChartData';
import { formatCurrency } from '$utils/formatCurrency';

type AccountTypeBalanceChartProps = {
  data: AccountDto[];
  className?: string;
};

const ALLOWED_ACCOUNT_TYPES = [
  AccountType.Savings,
  AccountType.Cash,
  AccountType.LongTermSavings,
  AccountType.PreAssignedCash,
  AccountType.Investment,
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
    [AccountType.Savings]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.Savings].label,
      color: 'var(--account-SAVINGS)',
      valueFormatter: calculateBalancePercentage,
    },
    [AccountType.Cash]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.Cash].label,
      color: 'var(--account-CASH)',
      valueFormatter: calculateBalancePercentage,
    },
    [AccountType.LongTermSavings]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.LongTermSavings].label,
      color: 'var(--account-LONG-TERM-SAVINGS)',
      valueFormatter: calculateBalancePercentage,
    },
    [AccountType.PreAssignedCash]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.PreAssignedCash].label,
      color: 'var(--account-PRE-ASSIGNED-CASH)',
      valueFormatter: calculateBalancePercentage,
    },
    [AccountType.Investment]: {
      label: ACCOUNT_TYPE_MAPPING[AccountType.Investment].label,
      color: 'var(--account-INVESTMENT)',
      valueFormatter: calculateBalancePercentage,
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
