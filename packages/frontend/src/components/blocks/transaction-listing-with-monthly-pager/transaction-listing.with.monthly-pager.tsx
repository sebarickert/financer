import { useState, useEffect, useCallback, useMemo } from 'react';

import { Pager } from '../pager/pager';

import { TransactionListingWithMonthlyPagerSummary } from './transaction-listing.with.monthly-pager.summary';

import {
  TransactionsFindAllByUserApiArg,
  useTransactionsFindAllByUserQuery,
} from '$api/generated/financerApi';
import {
  LatestTransactions,
  LatestTransactionsProps,
} from '$blocks/latest-transactions/latest-transactions';
import { monthNames } from '$constants/months';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { parseYearMonthFromString } from '$utils/formatDate';

export const initialMonthFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
} satisfies TransactionsFindAllByUserApiArg;

interface TransactionListingWithMonthlyPagerProps {
  className?: string;
  initialDate?: string;
  initialPage?: number;
  isSummaryVisible?: boolean;
  additionalFilterOptions?: any;
  useDataHook?: LatestTransactionsProps['useDataHook'];
}

export const TransactionListingWithMonthlyPager = ({
  className = '',
  initialDate,
  initialPage = 1,
  isSummaryVisible,
  additionalFilterOptions,
  useDataHook = useTransactionsFindAllByUserQuery,
}: TransactionListingWithMonthlyPagerProps): JSX.Element | null => {
  const { push } = useViewTransitionRouter();

  const [selectedPage, setSelectedPage] = useState(initialPage);

  const baseFilterOptions = {
    ...initialMonthFilterOptions,
    ...additionalFilterOptions,
  };

  const [filterOptions, setFilterOptions] = useState(
    !parseYearMonthFromString(initialDate)
      ? baseFilterOptions
      : {
          ...baseFilterOptions,
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

  const handleMonthOptionChange = useCallback(
    (direction: 'next' | 'previous') => {
      const { month, year } = filterOptions;
      const monthWithTwoDigits = month.toString().padStart(2, '0');
      const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

      selectedMonth.setMonth(
        selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
      );

      setFilterOptions((prev: any) => ({
        ...prev,
        month: selectedMonth.getMonth() + 1,
        year: selectedMonth.getFullYear(),
      }));
    },
    [filterOptions]
  );

  const pagerOptions = useMemo(() => {
    const firstAvailableTransaction = new Date(transaction?.date || new Date());

    return {
      nextPage: {
        isAvailable: !(
          filterOptions.month === initialMonthFilterOptions.month &&
          filterOptions.year === initialMonthFilterOptions.year
        ),
        load: () => handleMonthOptionChange('next'),
      },
      previousPage: {
        isAvailable: !(
          filterOptions.month === firstAvailableTransaction.getMonth() + 1 &&
          filterOptions.year === firstAvailableTransaction.getFullYear()
        ),
        load: () => handleMonthOptionChange('previous'),
      },
    };
  }, [
    filterOptions.month,
    filterOptions.year,
    handleMonthOptionChange,
    transaction?.date,
  ]);

  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];
  const pagerLabel = `${pageVisibleMonth} ${pageVisibleYear}`;

  return (
    <section className={className}>
      <Pager className="mb-4" pagerOptions={pagerOptions}>
        {pagerLabel}
      </Pager>
      <LoaderSuspense>
        {isSummaryVisible && (
          <TransactionListingWithMonthlyPagerSummary
            filterOptions={filterOptions}
          />
        )}
        <LatestTransactions
          filterOptions={filterOptions}
          className="mt-4"
          useDataHook={useDataHook}
          onPageChange={setSelectedPage}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </section>
  );
};
