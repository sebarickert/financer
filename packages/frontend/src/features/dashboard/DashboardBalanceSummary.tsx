import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsItem, DetailsList } from '$blocks/DetailsList';
import { transactionTypeLabelMapping } from '$constants/transaction/transactionTypeMapping';
import { TRANSACTION_TYPE_ICON_MAPPING } from '$features/transaction/TransactionTypeIcon';
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
      Icon: TRANSACTION_TYPE_ICON_MAPPING[TransactionType.Income],
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Income].plural,
      ),
      description: formatCurrency(totalIncomes),
    },
    {
      Icon: TRANSACTION_TYPE_ICON_MAPPING[TransactionType.Expense],
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Expense].plural,
      ),
      description: formatCurrency(totalExpenses),
    },
  ];

  return (
    <div
      className={clsx(className, 'grid gap-6 p-6 rounded-md bg-layer')}
      data-testid="dashboard-balance-summary"
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
    </div>
  );
};
