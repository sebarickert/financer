import { SortOrder } from '@local/types';
import { useState } from 'react';

import { MonthlySummaryGraph } from '../../components/blocks/monthly-summary-graph/monthly-summary-graph';
import {
  initialMonthFilterOptions,
  MonthlyTransactionList,
} from '../../components/blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '../../components/blocks/pager/pager';
import { Heading } from '../../components/elements/heading/heading';
import { IconName } from '../../components/elements/icon/icon';
import { LoaderSuspense } from '../../components/elements/loader/loader-suspense';
import { QuickLinks } from '../../components/elements/quick-links/quick-links';
import { QuickLinksItem } from '../../components/elements/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';
import { monthNames } from '../../constants/months';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';

export const Statistics = (): JSX.Element => {
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
      <UpdatePageInfo title="Statistics" />
      <MonthlySummaryGraph className="mb-6" />
      <section className="flex items-end justify-between mb-4">
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
        />
      </section>
      <LoaderSuspense>
        <MonthlyTransactionList
          monthFilterOptions={monthFilterOptions}
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
