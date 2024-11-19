import { FC } from 'react';

import { StatisticsLayout } from '$features/statistics/StatisticsLayout';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

export const StatisticsContainer: FC = () => {
  return (
    <StatisticsLayout title="Transactions">
      <TransactionListWithMonthlyPager isSummaryVisible />
    </StatisticsLayout>
  );
};
