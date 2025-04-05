import { FC } from 'react';

import { TransactionType } from '@/api/ssr-financer-api';
import {
  TransactionListOptions,
  getStatisticsSettings,
  getTransactionMonthlySummary,
} from '@/api-service';
import { BalanceDisplay } from '@/blocks/BalanceDisplay';
import { DetailsItem, DetailsList } from '@/blocks/DetailsList';
import { TRANSACTION_TYPE_MAPPING } from '@/constants/transaction/TRANSACTION_TYPE_MAPPING';
import { formatCurrency } from '@/utils/formatCurrency';

interface TransactionListWithMonthlySummaryProps {
  filterOptions: TransactionListOptions;
}

export const TransactionListWithMonthlySummary: FC<
  TransactionListWithMonthlySummaryProps
> = async ({ filterOptions }) => {
  const statisticsSettings = await getStatisticsSettings();

  const monthlySummary = (
    await getTransactionMonthlySummary({
      ...filterOptions,
      accountTypes: statisticsSettings?.accountTypes,
    })
  ).at(-1);

  if (!monthlySummary) {
    return null;
  }

  const monthlyDetails: DetailsItem[] = [
    {
      Icon: TRANSACTION_TYPE_MAPPING[TransactionType.INCOME].Icon,
      label: TRANSACTION_TYPE_MAPPING[TransactionType.INCOME].label.plural,

      description: formatCurrency(monthlySummary.incomeAmount) ?? '-',
    },
    {
      Icon: TRANSACTION_TYPE_MAPPING[TransactionType.EXPENSE].Icon,
      label: TRANSACTION_TYPE_MAPPING[TransactionType.EXPENSE].label.plural,

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
