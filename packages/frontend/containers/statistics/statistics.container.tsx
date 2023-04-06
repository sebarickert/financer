import { useCallback, useState } from 'react';

import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { Statistics } from '$pages/statistics/statistics';

export const StatisticsContainer = () => {
  const [monthFilterOptions, setMonthFilterOptions] = useState(
    initialMonthFilterOptions
  );
  const { data: transaction } = useFirstTransaction();

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
    <Statistics
      filterOptions={monthFilterOptions}
      firstAvailableTransaction={firstAvailableTransaction}
      onMonthOptionChange={handleMonthOptionChange}
    />
  );
};
