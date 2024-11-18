import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { StatisticsLayout } from '$features/statistics/StatisticsLayout';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

export const IncomeListingContainer: FC = () => {
  return (
    <StatisticsLayout title="Incomes">
      <TransactionListWithMonthlyPager type={TransactionType.Income} />
    </StatisticsLayout>
  );
};
