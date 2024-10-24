import { FC } from 'react';

import {
  TransactionMonthSummaryDto,
  TransactionType,
} from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { transactionTypeIconMapping } from '$constants/transaction/transactionTypeIconMapping';
import { ProminentDetailItem } from '$elements/ProminentDetailItem';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { formatCurrency } from '$utils/formatCurrency';

type TransactionListWithMonthlySummaryProps = {
  filterOptions: TransactionListOptions;
};

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
    label: 'Incomes',
    description: formatCurrency(incomeAmount) ?? '-',
    transactionType: TransactionType.Income,
  },
  {
    label: 'Expenses',
    description: formatCurrency(expenseAmount) ?? '-',
    transactionType: TransactionType.Expense,
  },
  {
    label: 'Balance',
    description: formatCurrency(totalAmount) ?? '-',
  },
];

export const TransactionListWithMonthlySummary: FC<
  TransactionListWithMonthlySummaryProps
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
    <List columns={3}>
      {monthlyDetails.map(({ label, description, transactionType }) => {
        const icon = transactionType
          ? transactionTypeIconMapping[transactionType]
          : 'EqualsIcon';

        const highlightColorMapping: Record<TransactionType, string> = {
          [TransactionType.Income]: 'bg-green-400/15',
          [TransactionType.Expense]: 'bg-red-400/15',
        } as Record<TransactionType, string>;

        return (
          <ProminentDetailItem
            icon={icon}
            label={label}
            key={label}
            highlightColor={
              transactionType
                ? highlightColorMapping[transactionType]
                : 'bg-gray-400/15'
            }
          >
            {description}
          </ProminentDetailItem>
        );
      })}
    </List>
  );
};