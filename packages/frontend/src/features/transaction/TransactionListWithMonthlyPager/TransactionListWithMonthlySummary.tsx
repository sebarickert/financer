import { FC } from 'react';

import {
  TransactionMonthSummaryDto,
  TransactionType,
} from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { transactionTypeThemeMapping } from '$constants/transaction/transactionTypeMapping';
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
    <List columns={3} testId="transaction-list-monthly-summary">
      {monthlyDetails.map(({ label, description, transactionType }) => {
        const icon = transactionType
          ? transactionTypeThemeMapping[transactionType].icon
          : 'EqualsIcon';

        return (
          <ProminentDetailItem
            icon={icon}
            label={label}
            key={label}
            highlightColor={
              transactionType
                ? transactionTypeThemeMapping[transactionType].color
                : undefined
            }
          >
            {description}
          </ProminentDetailItem>
        );
      })}
    </List>
  );
};
