import { FC } from 'react';

import { TransactionMonthSummaryDto } from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { IconName } from '$elements/icon/icon';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { formatCurrency } from '$utils/formatCurrency';

interface TransactionListingWithMonthlyPagerSummaryProps {
  filterOptions: TransactionListOptions;
}

const emptySummary = {
  totalAmount: NaN,
  expenseAmount: NaN,
  incomeAmount: NaN,
} as TransactionMonthSummaryDto;

const getSummaryDetails = ({
  totalAmount,
  expenseAmount,
  incomeAmount,
}: TransactionMonthSummaryDto) => [
  {
    icon: IconName.download,
    label: 'Incomes',
    description: (
      <span className="text-green">{formatCurrency(incomeAmount) ?? '-'}</span>
    ),
  },
  {
    icon: IconName.upload,
    label: 'Expenses',
    description: (
      <span className="text-red">{formatCurrency(expenseAmount) ?? '-'}</span>
    ),
  },
  {
    icon: IconName.plus,
    label: 'Net Total',
    description: formatCurrency(totalAmount) ?? '-',
  },
];

export const TransactionListingWithMonthlyPagerSummary: FC<
  TransactionListingWithMonthlyPagerSummaryProps
> = async ({ filterOptions }) => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  const monthlySummary = await TransactionService.getMonthlySummary({
    ...filterOptions,
    accountTypes: statisticsSettings?.accountTypes,
  });

  const monthlyDetails = getSummaryDetails(
    monthlySummary.at(-1) ?? emptySummary,
  );

  return (
    <DetailsList
      items={monthlyDetails}
      className="mb-4 py-4 border-t border-b border-gray-dark"
    />
  );
};
