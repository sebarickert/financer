import { FC } from 'react';

import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { StatisticsLayout } from '$features/statistics/StatisticsLayout';
import { UserService } from '$ssr/api/user.service';

export const StatisticsOverviewContainer: FC = async () => {
  const theme = await UserService.getOwnUserTheme();

  return (
    <StatisticsLayout title="Overview">
      <MonthlySummaryGraph className="mb-6" userTheme={theme} />
    </StatisticsLayout>
  );
};
