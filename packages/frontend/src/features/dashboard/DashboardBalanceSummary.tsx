import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '@/api/ssr-financer-api';
import { BalanceDisplay } from '@/blocks/BalanceDisplay';
import { Card } from '@/blocks/Card/Card';
import { DetailsItem, DetailsList } from '@/blocks/DetailsList';
import { TRANSACTION_TYPE_MAPPING } from '@/constants/transaction/TRANSACTION_TYPE_MAPPING';
import { formatCurrency } from '@/utils/formatCurrency';

interface DashboardBalanceSummaryProps {
  className?: string;
  totalBalance: number;
  previousMonthBalance?: number;
  totalIncomes: number;
  totalExpenses: number;
}

const getBalanceDifference = (
  totalBalance: number,
  previousMonthBalance?: number,
) => {
  if (previousMonthBalance === undefined) {
    return;
  }

  const balanceDifference = totalBalance - previousMonthBalance;
  const percentageDifference = (balanceDifference / previousMonthBalance) * 100;
  const formattedPercentageDifference = `${percentageDifference > 0 ? '+' : ''}${Number.isInteger(percentageDifference) ? percentageDifference : percentageDifference.toFixed(2)}%`;

  return {
    balanceDifference,
    percentageDifference: formattedPercentageDifference,
  };
};

export const DashboardBalanceSummary: FC<DashboardBalanceSummaryProps> = ({
  className,
  totalBalance,
  totalIncomes,
  totalExpenses,
  previousMonthBalance,
}) => {
  const { balanceDifference, percentageDifference } =
    getBalanceDifference(totalBalance, previousMonthBalance) ?? {};

  const monthlyDetails: DetailsItem[] = [
    {
      Icon: TRANSACTION_TYPE_MAPPING[TransactionType.INCOME].Icon,
      label: TRANSACTION_TYPE_MAPPING[TransactionType.INCOME].label.plural,
      description: formatCurrency(totalIncomes),
    },
    {
      Icon: TRANSACTION_TYPE_MAPPING[TransactionType.EXPENSE].Icon,
      label: TRANSACTION_TYPE_MAPPING[TransactionType.EXPENSE].label.plural,
      description: formatCurrency(totalExpenses),
    },
  ];

  return (
    <Card
      data-testid="dashboard-balance-summary"
      className={clsx(className, 'grid gap-6')}
    >
      <BalanceDisplay label="Balance" amount={totalBalance}>
        {balanceDifference && percentageDifference && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            <span data-testid="dashboard-month-balance">
              {formatCurrency(balanceDifference, true)}
            </span>
            <span> ({percentageDifference}) from last month</span>
          </p>
        )}
      </BalanceDisplay>
      <DetailsList items={monthlyDetails} />
    </Card>
  );
};
