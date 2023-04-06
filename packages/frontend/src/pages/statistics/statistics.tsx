import { MonthlySummaryGraph } from '$blocks/monthly-summary-graph/monthly-summary-graph';
import {
  initialMonthFilterOptions,
  MonthlyTransactionList,
} from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { QuickLinks } from '$elements/quick-links/quick-links';
import { QuickLinksItem } from '$elements/quick-links/quick-links.item';
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
      <section className="flex items-end justify-between mb-4">
        <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
        <Pager
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
        />
      </section>
      <LoaderSuspense>
        <MonthlyTransactionList
          monthFilterOptions={filterOptions}
          isSummaryVisible
        />
      </LoaderSuspense>
      <QuickLinks className="mt-8">
        <QuickLinksItem
          title="Incomes"
          link="/statistics/incomes"
          iconName={IconName.download}
        />
        <QuickLinksItem
          title="Expenses"
          link="/statistics/expenses"
          iconName={IconName.upload}
        />
        <QuickLinksItem
          title="Transfers"
          link="/statistics/transfers"
          iconName={IconName.switchHorizontal}
        />
      </QuickLinks>
    </>
  );
};
