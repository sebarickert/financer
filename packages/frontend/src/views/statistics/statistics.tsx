import { FC } from 'react';

import { List } from '$blocks/List';
import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { ProminentLink } from '$blocks/ProminentLink';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const Statistics: FC = () => {
  return (
    <>
      <UpdatePageInfo />
      <MonthlySummaryGraph className="mb-6" />
      <TransactionListingWithMonthlyPager isSummaryVisible />
      <List className="mt-8">
        <ProminentLink link="/statistics/incomes" icon={'ArrowDownTrayIcon'}>
          Incomes
        </ProminentLink>
        <ProminentLink link="/statistics/expenses" icon={'ArrowUpTrayIcon'}>
          Expenses
        </ProminentLink>
        <ProminentLink
          link="/statistics/transfers"
          icon={'ArrowsRightLeftIcon'}
        >
          Transfers
        </ProminentLink>
      </List>
    </>
  );
};
