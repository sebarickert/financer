import { FC } from 'react';

import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { TransactionListWithMonthlyPager } from '$blocks/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const Statistics: FC = () => {
  return (
    <>
      <UpdatePageInfo />
      <MonthlySummaryGraph className="mb-6" />
      <TransactionListWithMonthlyPager isSummaryVisible />
    </>
  );
};
