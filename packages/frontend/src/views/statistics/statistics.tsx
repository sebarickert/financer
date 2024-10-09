import { FC } from 'react';

import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const Statistics: FC = () => {
  return (
    <>
      <UpdatePageInfo />
      <MonthlySummaryGraph className="mb-6" />
      <TransactionListingWithMonthlyPager isSummaryVisible />
      <LinkList className="mt-8" isVertical>
        <LinkListLink link="/statistics/incomes" icon={'ArrowDownTrayIcon'}>
          Incomes
        </LinkListLink>
        <LinkListLink link="/statistics/expenses" icon={'ArrowUpTrayIcon'}>
          Expenses
        </LinkListLink>
        <LinkListLink link="/statistics/transfers" icon={'ArrowsRightLeftIcon'}>
          Transfers
        </LinkListLink>
      </LinkList>
    </>
  );
};
