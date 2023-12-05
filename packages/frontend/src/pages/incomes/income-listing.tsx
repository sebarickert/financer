import { useIncomesFindAllByUserQuery } from '$api/generated/financerApi';
import { LatestTransactions } from '$blocks/latest-transactions/latest-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { ButtonInternal } from '$elements/button/button.internal';
import { Heading } from '$elements/heading/heading';
import { Icon, IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface IncomeListingProps {
  filterOptions: typeof initialMonthFilterOptions;
  firstAvailableTransaction: Date;
  initialPageToLoad: number;
  onPageChange: (page: number) => void;
  onMonthOptionChange: (direction: 'next' | 'previous') => void;
}

export const IncomeListing = ({
  filterOptions,
  firstAvailableTransaction,
  initialPageToLoad,
  onPageChange,
  onMonthOptionChange,
}: IncomeListingProps): JSX.Element => {
  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];

  return (
    <>
      <UpdatePageInfo
        title="Incomes"
        backLink="/statistics"
        headerAction={
          <ButtonInternal
            link="/statistics/incomes/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Add income</span>
            <Icon type={IconName.plus} />
          </ButtonInternal>
        }
      />
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
        <LatestTransactions
          filterOptions={filterOptions}
          className="mt-4"
          useDataHook={useIncomesFindAllByUserQuery}
          onPageChange={onPageChange}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </>
  );
};
