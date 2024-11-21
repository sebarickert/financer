import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import {
  transactionTypeLabelMapping,
  transactionTypeThemeMapping,
} from '$constants/transaction/transactionTypeMapping';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';

type DashboardBalanceSummaryProps = {
  className?: string;
  totalBalance: number;
  previousMonthBalance?: number;
  totalIncomes: number;
  totalExpenses: number;
};

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
      icon: transactionTypeThemeMapping[TransactionType.Income].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Income].plural,
      ),
      description: formatCurrency(totalIncomes),
    },
    {
      icon: transactionTypeThemeMapping[TransactionType.Expense].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Expense].plural,
      ),
      description: formatCurrency(totalExpenses),
    },
  ];

  return (
    <div className={clsx(className, 'grid gap-6 p-6 rounded-md bg-layer')}>
      <div>
        <p className="text-muted-foreground">Balance</p>
        <p className={clsx('text-4xl font-semibold break-all')}>
          <span>{formatCurrency(totalBalance)}</span>
        </p>
        {balanceDifference && percentageDifference && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatCurrency(balanceDifference, true)} ({percentageDifference})
            from last month
          </p>
        )}
      </div>
      <DetailsList items={monthlyDetails} />
    </div>
  );
};
