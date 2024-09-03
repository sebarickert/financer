import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const Statistics = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo />
      <MonthlySummaryGraph className="mb-6" />
      <TransactionListingWithMonthlyPager isSummaryVisible />
      <LinkList className="mt-8" isVertical>
        <LinkListLink link="/statistics/incomes" icon={IconName.download}>
          Incomes
        </LinkListLink>
        <LinkListLink link="/statistics/expenses" icon={IconName.upload}>
          Expenses
        </LinkListLink>
        <LinkListLink
          link="/statistics/transfers"
          icon={IconName.switchHorizontal}
        >
          Transfers
        </LinkListLink>
      </LinkList>
    </>
  );
};
