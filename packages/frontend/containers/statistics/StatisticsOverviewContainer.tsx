import { FC } from 'react';

import { StatisticsLayout } from '$features/statistics/StatisticsLayout';
import { StatisticsOverviewData } from '$features/statistics/StatisticsOverviewData';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { generateDateFromYearAndMonth } from '$utils/generateDateFromYearAndMonth';

export const StatisticsOverviewContainer: FC = async () => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const transactionMonthSummaries = await TransactionService.getMonthlySummary({
    ...accountTypeFilter,
  });

  const monthlySummaryHistory = transactionMonthSummaries
    .map(({ id: { year: targetYear, month: targetMonth }, ...rest }) => {
      return {
        ...rest,
        year: targetYear,
        month: targetMonth,
        date: generateDateFromYearAndMonth(targetYear, targetMonth),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <StatisticsLayout title="Overview">
      <StatisticsOverviewData data={monthlySummaryHistory} />
    </StatisticsLayout>
  );
};
