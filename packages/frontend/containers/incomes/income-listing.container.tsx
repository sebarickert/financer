import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { IncomeListing } from '$pages/income/income-listing';
import { parseYearMonthFromString } from '$utils/formatDate';

interface IncomeListingContainerProps {
  date?: string;
  page?: number;
}

export const IncomeListingContainer = ({
  date: initialDate,
  page: initialPage = 1,
}: IncomeListingContainerProps) => {
  const { push } = useRouter();

  const [selectedPage, setSelectedPage] = useState(initialPage);

  const [monthFilterOptions, setMonthFilterOptions] = useState(
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
    const year = monthFilterOptions.year;
    const month = monthFilterOptions.month.toString().padStart(2, '0');

    const params = new URLSearchParams(window.location.search);
    params.set('date', `${year}-${month}`);
    params.set('page', selectedPage.toString());

    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params}`
    );

    setInitialPage(1);
  }, [monthFilterOptions.year, monthFilterOptions.month, push, selectedPage]);

  const firstAvailableTransaction = new Date(transaction?.date || new Date());

  const handleMonthOptionChange = useCallback(
    (direction: 'next' | 'previous') => {
      const { month, year } = monthFilterOptions;
      const monthWithTwoDigits = month.toString().padStart(2, '0');
      const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

      selectedMonth.setMonth(
        selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
      );

      setMonthFilterOptions({
        month: selectedMonth.getMonth() + 1,
        year: selectedMonth.getFullYear(),
      });
    },
    [monthFilterOptions]
  );

  return (
    <IncomeListing
      firstAvailableTransaction={firstAvailableTransaction}
      initialPageToLoad={initialPageToLoad}
      filterOptions={monthFilterOptions}
      onMonthOptionChange={handleMonthOptionChange}
      onPageChange={setSelectedPage}
    />
  );
};
