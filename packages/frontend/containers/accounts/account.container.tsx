import { useState } from 'react';

import { useAccountsFindOneByIdQuery } from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { Account } from '$pages/accounts/account';

interface AccountContainerProps {
  id: string;
}

export const AccountContainer = ({ id }: AccountContainerProps) => {
  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;

  const [monthFilterOptions, setMonthFilterOptions] = useState(
    initialMonthFilterOptions
  );
  const { data: transaction } = useFirstTransaction();

  const handleMonthOptionChange = (direction: 'next' | 'previous') => {
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
  };

  const firstAvailableTransaction = new Date(transaction?.date || new Date());

  // const isLoading =
  //   isLoadingMarketSettings || isCreatingIncome || isCreatingExpense;

  return (
    <>
      <DataHandler {...data} />
      {account && (
        <Account
          // @todo: fetch endpoiint loading states here
          isLoading={false}
          account={account}
          filterOptions={monthFilterOptions}
          firstAvailableTransaction={firstAvailableTransaction}
          onMonthOptionChange={handleMonthOptionChange}
        />
      )}
    </>
  );
};
