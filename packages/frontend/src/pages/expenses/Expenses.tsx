import { SortOrder } from '@local/types';
import { useState } from 'react';

import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LinkList } from '../../components/link-list/link-list';
import { LinkListLink } from '../../components/link-list/link-list.link';
import { LoaderSuspense } from '../../components/loader/loader-suspense';
import {
  initialMonthFilterOptions,
  MonthlyTransactionList,
} from '../../components/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '../../components/pager/pager';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { monthNames } from '../../constants/months';
import { useAllExpensesPaged } from '../../hooks/expense/useAllExpenses';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';

export const Expenses = (): JSX.Element => {
  const [monthFilterOptions, setMonthFilterOptions] = useState(
    initialMonthFilterOptions
  );
  const {
    data: {
      data: [transaction],
    },
  } = useAllTransactionsPaged(1, {
    limit: 1,
    sortOrder: SortOrder.ASC,
  });

  const firstTransactionEverDate = new Date(transaction?.date || new Date());

  const pageVisibleYear = monthFilterOptions.year;
  const pageVisibleMonth = monthNames[monthFilterOptions.month - 1];

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

  return (
    <>
      <UpdatePageInfo title="Expenses" />
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
                monthFilterOptions.month === initialMonthFilterOptions.month &&
                monthFilterOptions.year === initialMonthFilterOptions.year
              ),
              load: () => handleMonthOptionChange('next'),
            },
            previousPage: {
              isAvailable: !(
                monthFilterOptions.month ===
                  firstTransactionEverDate.getMonth() + 1 &&
                monthFilterOptions.year ===
                  firstTransactionEverDate.getFullYear()
              ),
              load: () => handleMonthOptionChange('previous'),
            },
          }}
        ></Pager>
      </section>
      <LoaderSuspense>
        <MonthlyTransactionList
          monthFilterOptions={monthFilterOptions}
          useDataHook={useAllExpensesPaged}
        />
      </LoaderSuspense>
    </>
  );
};
