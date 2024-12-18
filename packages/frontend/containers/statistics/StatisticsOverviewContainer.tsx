import { FC } from 'react';

import { StatisticsOverviewData } from '$features/statistics/StatisticsOverviewData';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';
import { DateService } from '$services/DateService';
import { TransactionService } from '$ssr/api/TransactionService';
import { UserPreferenceService } from '$ssr/api/UserPreferenceService';

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
        date: DateService.createFromYearAndMonth(targetYear, targetMonth),
      };
    })
    .sort((a, b) => a.date.toMillis() - b.date.toMillis())
    .map((item) => ({ ...item, date: item.date.toISO() as string }));

  return (
    <TransactionsLayout title="Statistics">
      <StatisticsOverviewData data={monthlySummaryHistory} />
    </TransactionsLayout>
  );
};
