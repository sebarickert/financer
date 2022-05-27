import { SortOrder } from '@local/types';
import { useState } from 'react';

import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LatestTransactions } from '../../components/latest-transactions/latest-transactions';
import { LoaderSuspense } from '../../components/loader/loader-suspense';
import { MonthlySummaryGraph } from '../../components/monthly-summary-graph/monthly-summary-graph';
import { Pager } from '../../components/pager/pager';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { monthNames } from '../../constants/months';
import { useExpenseMonthlySummaries } from '../../hooks/expense/useExpenseMonthlySummaries';
import { useIncomeMonthlySummaries } from '../../hooks/income/useIncomeMonthlySummaries';
import { useUserStatisticsSettings } from '../../hooks/profile/user-preference/useStatisticsSettings';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';
import { formatCurrency } from '../../utils/formatCurrency';

const initialFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

const emptyTotalAmount = { totalAmount: 0 };

const MonthStatistics = ({
  monthFilterOptions,
}: {
  monthFilterOptions: typeof initialFilterOptions;
}) => {
  const [statisticsSettings] = useUserStatisticsSettings();
  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const incomeSummaries = useIncomeMonthlySummaries({
    ...monthFilterOptions,
    ...accountTypeFilter,
  });
  const expenseSummaries = useExpenseMonthlySummaries({
    ...monthFilterOptions,
    ...accountTypeFilter,
  });

  const { totalAmount: totalIncomes } =
    incomeSummaries.at(-1) ?? emptyTotalAmount;
  const { totalAmount: totalExpenses } =
    expenseSummaries.at(-1) ?? emptyTotalAmount;

  return (
    <>
      <DescriptionList>
        <DescriptionListItem label="Incomes">
          {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
        </DescriptionListItem>
        <DescriptionListItem label="Expenses">
          {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
        </DescriptionListItem>
      </DescriptionList>
      <LatestTransactions filterOptions={monthFilterOptions} className="mt-4" />
    </>
  );
};

export const Statistics = (): JSX.Element => {
  const [monthFilterOptions, setMonthFilterOptions] =
    useState(initialFilterOptions);
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
      <section className="flex items-center justify-between mb-4">
        <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
        <Pager
          pagerOptions={{
            nextPage: {
              isAvailable: !(
                monthFilterOptions.month === initialFilterOptions.month &&
                monthFilterOptions.year === initialFilterOptions.year
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
        <MonthStatistics monthFilterOptions={monthFilterOptions} />
      </LoaderSuspense>
      <QuickLinks className="mt-8">
        <QuickLinksItem
          title="Incomes"
          link="/statistics/incomes"
          iconName={IconName.download}
          iconBackgroundColor="green"
          description="Go to incomes page where you are able to manage your income transactions."
        />
        <QuickLinksItem
          title="Expenses"
          link="/statistics/expenses"
          iconName={IconName.upload}
          iconBackgroundColor="red"
          description="Go to expenses page where you are able to manage your expense transactions."
        />
        <QuickLinksItem
          title="Transfers"
          link="/statistics/transfers"
          iconName={IconName.switchHorizontal}
          description="Go to transfers page where you are able to manage your transfer transactions."
        />
      </QuickLinks>
    </>
  );
};
