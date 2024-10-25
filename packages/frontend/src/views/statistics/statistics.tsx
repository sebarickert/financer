import { FC } from 'react';

import { Theme } from '$api/generated/financerApi';
import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

type StatisticsProps = {
  userTheme: Theme;
};

export const Statistics: FC<StatisticsProps> = ({ userTheme }) => {
  return (
    <>
      <UpdatePageInfo />
      <MonthlySummaryGraph className="mb-6" userTheme={userTheme} />
      <TransactionListWithMonthlyPager isSummaryVisible />
    </>
  );
};
