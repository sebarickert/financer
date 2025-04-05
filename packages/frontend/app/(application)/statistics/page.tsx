import { Metadata } from 'next';

import {
  getStatisticsSettings,
  getTransactionMonthlySummary,
} from '@/api-service';
import { StatisticsOverviewData } from '@/features/statistics/StatisticsOverviewData';
import { ContentHeader } from '@/layouts/ContentHeader';
import { DateService } from '@/services/DateService';

export const metadata: Metadata = {
  title: 'Statistics',
};

export default async function StatisticsOverviewPage() {
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
    <>
      <ContentHeader title="Statistics" />
      <StatisticsOverviewData data={monthlySummaryHistory} />
    </>
  );
}
