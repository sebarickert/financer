import { FC } from 'react';

import {
  getStatisticsSettings,
  getTransactionMonthlySummary,
} from '@/api-service';
import { StatisticsOverviewData } from '@/features/statistics/StatisticsOverviewData';
import { TransactionsLayout } from '@/features/transactions/TransactionsLayout';
import { DateService } from '@/services/DateService';

export const StatisticsOverviewContainer: FC = async () => {
  const statisticsSettings = await getStatisticsSettings();

  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const transactionMonthSummaries = await getTransactionMonthlySummary({
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => ({ ...item, date: item.date.toISO()! }));

  return (
    <TransactionsLayout title="Statistics">
      <StatisticsOverviewData data={monthlySummaryHistory} />
    </TransactionsLayout>
  );
};
