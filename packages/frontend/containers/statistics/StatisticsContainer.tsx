import { FC } from 'react';

import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { Layout } from '$layouts/Layout';
import { UserService } from '$ssr/api/user.service';

export const StatisticsContainer: FC = async () => {
  const theme = await UserService.getOwnUserTheme();

  return (
    <Layout title="Statistics">
      <MonthlySummaryGraph className="mb-8" userTheme={theme} />
      <TransactionListWithMonthlyPager isSummaryVisible />
    </Layout>
  );
};
