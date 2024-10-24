import { FC } from 'react';

import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const Statistics: FC = () => {
  return (
    <>
      <UpdatePageInfo />
      <MonthlySummaryGraph className="mb-6" />
      <TransactionListingWithMonthlyPager isSummaryVisible />
    </>
  );
};
