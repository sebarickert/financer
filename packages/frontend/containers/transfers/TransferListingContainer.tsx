import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { StatisticsLayout } from '$features/statistics/StatisticsLayout';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';

export const TransferListingContainer: FC = () => {
  return (
    <StatisticsLayout title="Transfers">
      <TransactionListWithMonthlyPager type={TransactionType.Transfer} />
    </StatisticsLayout>
  );
};
