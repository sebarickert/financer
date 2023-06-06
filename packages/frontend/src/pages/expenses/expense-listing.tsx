import { useExpensesFindAllByUserQuery } from '$api/generated/financerApi';
import { LatestTransactions } from '$blocks/latest-transactions/latest-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface ExpenseListingProps {
  filterOptions: typeof initialMonthFilterOptions;
  firstAvailableTransaction: Date;
  initialPageToLoad: number;
  onPageChange: (page: number) => void;
  onMonthOptionChange: (direction: 'next' | 'previous') => void;
}

export const ExpenseListing = ({
  filterOptions,
  firstAvailableTransaction,
  initialPageToLoad,
  onPageChange,
  onMonthOptionChange,
}: ExpenseListingProps): JSX.Element => {
  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];

  return (
    <>
      <UpdatePageInfo title="Expenses" backLink="/statistics" />
      <section className="mb-8">
        <LinkList>
          <LinkListLink
            testId="add-expense"
            link="/statistics/expenses/add"
            icon={IconName.download}
          >
            Add expense
          </LinkListLink>
        </LinkList>
      </section>
      <section className="flex items-center justify-between mb-4">
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
        <LatestTransactions
          filterOptions={filterOptions}
          className="mt-4"
          useDataHook={useExpensesFindAllByUserQuery}
          onPageChange={onPageChange}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </>
  );
};
