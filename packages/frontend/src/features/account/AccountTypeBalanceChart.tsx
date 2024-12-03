'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { AccountDto, AccountType } from '$api/generated/financerApi';
import { DetailsItem, DetailsList } from '$blocks/DetailsList';
import { PieChartDonut } from '$charts/PieChartDonut';
import { accountTypeMapping } from '$constants/account/accountTypeMapping';
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
          .map(({ balance }) => balance)
          .reduce((acc, curr) => acc + curr, 0),
      ],
    ),
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

  const chartConfig = {
    [AccountType.Savings]: {
      label: accountTypeMapping[AccountType.Savings].label,
      color: 'hsl(var(--color-blue))',
      valueFormatter: formatCurrency,
    },
    [AccountType.Cash]: {
      label: accountTypeMapping[AccountType.Cash].label,
      color: 'hsl(var(--color-gold))',
      valueFormatter: formatCurrency,
    },
    [AccountType.LongTermSavings]: {
      label: accountTypeMapping[AccountType.LongTermSavings].label,
      color: 'hsl(var(--color-dark-blue))',
      valueFormatter: formatCurrency,
    },
    [AccountType.PreAssignedCash]: {
      label: accountTypeMapping[AccountType.PreAssignedCash].label,
      color: 'hsl(var(--color-soft-gray))',
      valueFormatter: formatCurrency,
    },
    [AccountType.Investment]: {
      label: accountTypeMapping[AccountType.Investment].label,
      color: 'hsl(var(--color-green))',
      valueFormatter: formatCurrency,
    },
  } satisfies ChartConfig;

  const accountDetails: DetailsItem[] = Object.entries(accountTypeBalances)
    .filter(([, balance]) => balance > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([key, balance]) => {
      return {
        icon: accountTypeMapping[key as AccountType].icon,
        label: accountTypeMapping[key as AccountType].label,
        description: formatCurrency(balance),
      };
    });

  if (chartData.length === 0 || accountDetails.length === 0) {
    return null;
  }

  return (
    <div className={clsx(className, 'bg-layer rounded-md p-6 @container')}>
      <div className="@[645px]:grid @[645px]:grid-cols-[350px,1fr] gap-4 items-center">
        <PieChartDonut config={chartConfig} data={chartData} />
        <DetailsList items={accountDetails} />
      </div>
    </div>
  );
};
