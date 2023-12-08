import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import {
  initialMonthFilterOptions,
  MonthlyTransactionList,
} from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface StatisticsProps {
  filterOptions: typeof initialMonthFilterOptions;
  firstAvailableTransaction: Date;
  onMonthOptionChange: (direction: 'next' | 'previous') => void;
}

export const Statistics = ({
  filterOptions,
  firstAvailableTransaction,
  onMonthOptionChange,
}: StatisticsProps): JSX.Element => {
  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];

  return (
    <>
      <UpdatePageInfo title="Statistics" />
      <MonthlySummaryGraph className="mb-6" />
      <Pager
        className="mb-4"
        pagerOptions={{
          nextPage: {
            isAvailable: !(
              filterOptions.month === initialMonthFilterOptions.month &&
              filterOptions.year === initialMonthFilterOptions.year
            ),
            load: () => onMonthOptionChange('next'),
          },
          previousPage: {
            isAvailable: !(
              filterOptions.month ===
                firstAvailableTransaction.getMonth() + 1 &&
              filterOptions.year === firstAvailableTransaction.getFullYear()
            ),
            load: () => onMonthOptionChange('previous'),
          },
        }}
      >{`${pageVisibleMonth} ${pageVisibleYear}`}</Pager>
      <LoaderSuspense>
        <MonthlyTransactionList
          monthFilterOptions={filterOptions}
          isSummaryVisible
        />
      </LoaderSuspense>
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
