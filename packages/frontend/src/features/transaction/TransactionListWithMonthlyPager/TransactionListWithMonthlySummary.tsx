import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsItem, DetailsList } from '$blocks/DetailsList';
import { TRANSACTION_TYPE_MAPPING } from '$constants/transaction/TRANSACTION_TYPE_MAPPING';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/TransactionService';
import { UserPreferenceService } from '$ssr/api/UserPreferenceService';
import { formatCurrency } from '$utils/formatCurrency';

interface TransactionListWithMonthlySummaryProps {
  filterOptions: TransactionListOptions;
}

export const TransactionListWithMonthlySummary: FC<
  TransactionListWithMonthlySummaryProps
> = async ({ filterOptions }) => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  const monthlySummary = (
    await TransactionService.getMonthlySummary({
      ...filterOptions,
      accountTypes: statisticsSettings?.accountTypes,
    })
  ).at(-1);

  if (!monthlySummary) {
    return null;
  }

  const monthlyDetails: DetailsItem[] = [
    {
      Icon: TRANSACTION_TYPE_MAPPING[TransactionType.Income].Icon,
      label: TRANSACTION_TYPE_MAPPING[TransactionType.Income].label.plural,

      description: formatCurrency(monthlySummary.incomeAmount) ?? '-',
    },
    {
      Icon: TRANSACTION_TYPE_MAPPING[TransactionType.Expense].Icon,
      label: TRANSACTION_TYPE_MAPPING[TransactionType.Expense].label.plural,

      description: formatCurrency(monthlySummary.expenseAmount) ?? '-',
    },
  ];

  const calculatedBalance =
    monthlySummary.incomeAmount - monthlySummary.expenseAmount;

  return (
    <div data-testid="transaction-list-monthly-summary" className="grid gap-6">
      <BalanceDisplay label="Balance" amount={calculatedBalance} />
      <DetailsList items={monthlyDetails} />
    </div>
  );
};
