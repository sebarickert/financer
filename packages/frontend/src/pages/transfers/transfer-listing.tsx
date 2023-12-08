import { useTransfersFindAllByUserQuery } from '$api/generated/financerApi';
import { LatestTransactions } from '$blocks/latest-transactions/latest-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { ButtonInternal } from '$elements/button/button.internal';
import { Icon, IconName } from '$elements/icon/icon';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface TransferListingProps {
  filterOptions: typeof initialMonthFilterOptions;
  firstAvailableTransaction: Date;
  initialPageToLoad: number;
  onPageChange: (page: number) => void;
  onMonthOptionChange: (direction: 'next' | 'previous') => void;
}

export const TransferListing = ({
  filterOptions,
  firstAvailableTransaction,
  initialPageToLoad,
  onPageChange,
  onMonthOptionChange,
}: TransferListingProps): JSX.Element => {
  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];

  return (
    <>
      <UpdatePageInfo
        title="Transfers"
        backLink="/statistics"
        headerAction={
          <ButtonInternal
            link="/statistics/transfers/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
          >
            <span className="sr-only">Add transfer</span>
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
          useDataHook={useTransfersFindAllByUserQuery}
          onPageChange={onPageChange}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </>
  );
};
