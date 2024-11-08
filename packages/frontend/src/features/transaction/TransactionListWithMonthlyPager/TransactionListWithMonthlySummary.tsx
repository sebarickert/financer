import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { monthNames } from '$constants/months';
import {
  transactionTypeLabelMapping,
  transactionTypeThemeMapping,
} from '$constants/transaction/transactionTypeMapping';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';

type TransactionListWithMonthlySummaryProps = {
  filterOptions: TransactionListOptions;
};

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
      icon: transactionTypeThemeMapping[TransactionType.Income].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Income].plural,
      ),
      description: formatCurrency(monthlySummary.incomeAmount) ?? '-',
    },
    {
      icon: transactionTypeThemeMapping[TransactionType.Expense].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Expense].plural,
      ),
      description: formatCurrency(monthlySummary.expenseAmount) ?? '-',
    },
    {
      icon: 'EqualsIcon',
      label: 'Balance',
      description: formatCurrency(monthlySummary.totalAmount) ?? '-',
    },
  ];

  const { year, month } = monthlySummary.id;
  const heading = `${monthNames[month - 1]} ${year}`;

  return (
    <div className="p-6 theme-layer-color">
      <DetailsList heading={heading} items={monthlyDetails} />
    </div>
  );
};
