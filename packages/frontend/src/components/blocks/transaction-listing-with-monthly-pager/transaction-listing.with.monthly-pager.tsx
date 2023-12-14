import { useState, useEffect, useCallback } from 'react';

import { Pager } from '../pager/pager';

import {
  useExpensesFindAllByUserQuery,
  useIncomesFindAllByUserQuery,
  useTransactionsFindAllByUserQuery,
  useTransfersFindAllByUserQuery,
} from '$api/generated/financerApi';
import { LatestTransactions } from '$blocks/latest-transactions/latest-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { monthNames } from '$constants/months';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { parseYearMonthFromString } from '$utils/formatDate';

interface TransactionListingWithMonthlyPagerProps {
  initialDate?: string;
  initialPage?: number;
  useDataHook?:
    | typeof useTransactionsFindAllByUserQuery
    | typeof useIncomesFindAllByUserQuery
    | typeof useExpensesFindAllByUserQuery
    | typeof useTransfersFindAllByUserQuery;
}

export const TransactionListingWithMonthlyPager = ({
  initialDate,
  initialPage = 1,
  useDataHook = useTransactionsFindAllByUserQuery,
}: TransactionListingWithMonthlyPagerProps): JSX.Element | null => {
  const { push } = useViewTransitionRouter();

  const [selectedPage, setSelectedPage] = useState(initialPage);

  const [filterOptions, setFilterOptions] = useState(
    !parseYearMonthFromString(initialDate)
      ? initialMonthFilterOptions
      : {
          ...initialMonthFilterOptions,
          ...parseYearMonthFromString(initialDate),
          page: selectedPage,
        }
  );
  const { data: transaction } = useFirstTransaction();

  const [initialPageToLoad, setInitialPage] = useState(selectedPage);

  useEffect(() => {
    const year = filterOptions.year;
    const month = filterOptions.month.toString().padStart(2, '0');

    const params = new URLSearchParams(window.location.search);
    params.set('date', `${year}-${month}`);
    params.set('page', selectedPage.toString());

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`
    );

    setInitialPage(1);
  }, [filterOptions.year, filterOptions.month, push, selectedPage]);

  const firstAvailableTransaction = new Date(transaction?.date || new Date());

  const handleMonthOptionChange = useCallback(
    (direction: 'next' | 'previous') => {
      const { month, year } = filterOptions;
      const monthWithTwoDigits = month.toString().padStart(2, '0');
      const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

      selectedMonth.setMonth(
        selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
      );

      setFilterOptions({
        month: selectedMonth.getMonth() + 1,
        year: selectedMonth.getFullYear(),
      });
    },
    [filterOptions]
  );

  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];

  return (
    <>
      <Pager
        className="mb-4"
        pagerOptions={{
          nextPage: {
            isAvailable: !(
              filterOptions.month === initialMonthFilterOptions.month &&
              filterOptions.year === initialMonthFilterOptions.year
            ),
            load: () => handleMonthOptionChange('next'),
          },
          previousPage: {
            isAvailable: !(
              filterOptions.month ===
                firstAvailableTransaction.getMonth() + 1 &&
              filterOptions.year === firstAvailableTransaction.getFullYear()
            ),
            load: () => handleMonthOptionChange('previous'),
          },
        }}
      >{`${pageVisibleMonth} ${pageVisibleYear}`}</Pager>
      <LoaderSuspense>
        <LatestTransactions
          filterOptions={filterOptions}
          className="mt-4"
          useDataHook={useDataHook}
          onPageChange={setSelectedPage}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </>
  );
};
