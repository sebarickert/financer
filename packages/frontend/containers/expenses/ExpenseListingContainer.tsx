import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { StatisticsLayout } from '$features/statistics/StatisticsLayout';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

export const ExpenseListingContainer: FC = () => {
  return (
    <StatisticsLayout title="Expenses">
      <TransactionListWithMonthlyPager type={TransactionType.Expense} />
    </StatisticsLayout>
  );
};
