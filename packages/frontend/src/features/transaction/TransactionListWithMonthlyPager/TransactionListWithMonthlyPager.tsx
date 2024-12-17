import clsx from 'clsx';
import { Calendar } from 'lucide-react';
import { FC } from 'react';

import { GroupedTransactionList } from '../TransactionList/GroupedTransactionList';

import { TransactionListWithMonthlySummary } from './TransactionListWithMonthlySummary';

import { TransactionType } from '$api/generated/financerApi';
import { Pager } from '$blocks/Pager';
import { monthNames } from '$constants/months';
import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/TransactionService';
import {
  getNextMonth,
  getPreviousMonth,
  isValidYearMonth,
} from '$utils/formatDate';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

type TransactionListingWithMonthlyPagerProps = {
  className?: string;
  isSummaryVisible?: boolean;
  filterOptions?: TransactionListOptions;
  type?: TransactionType | null;
  queryDate?: string;
};

export const TransactionListWithMonthlyPager: FC<
  TransactionListingWithMonthlyPagerProps
> = async ({
  className = '',
  isSummaryVisible,
  filterOptions: additionalFilterOptions,
  type = null,
  queryDate,
}) => {
  const validQueryDate = isValidYearMonth(queryDate)
    ? queryDate
    : `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  const [year, month] = validQueryDate.split('-').map(Number);

  const filterOptions = {
    ...additionalFilterOptions,
    year,
    month,
  };

  const transactions = await TransactionService.getAllByType(
    type as null,
    filterOptions,
  );

  const previousMonth = getPreviousMonth(year, month);
  const nextMonth = getNextMonth(year, month);

  const [previousMonthTransactions, nextMonthTransactions] = await Promise.all([
    TransactionService.getAllByType(type as null, {
      ...additionalFilterOptions,
      year: previousMonth.year,
      month: previousMonth.month,
    }),
    TransactionService.getAllByType(type as null, {
      ...additionalFilterOptions,
      year: nextMonth.year,
      month: nextMonth.month,
    }),
  ]);

  const hasPreviousMonth = previousMonthTransactions.length > 0;
  const hasNextMonth = nextMonthTransactions.length > 0;

  const currentHref = `?date=${currentYear}-${String(currentMonth).padStart(2, '0')}`;
  const previousHref = hasPreviousMonth
    ? `?date=${previousMonth.year}-${String(previousMonth.month).padStart(2, '0')}`
    : undefined;
  const nextHref = hasNextMonth
    ? `?date=${nextMonth.year}-${String(nextMonth.month).padStart(2, '0')}`
    : undefined;

  const pagerLabel = `${monthNames[month - 1]} ${year}`;
  const hasSummaryVisible = isSummaryVisible && transactions.length > 0;
  const isValidButInTheFutureOrPast =
    !hasPreviousMonth &&
    !hasNextMonth &&
    !(year === currentYear && month === currentMonth);

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className={clsx('grid gap-6')}>
        <div data-slot="transaction-list-summary">
          <div className={clsx('p-6 rounded-md bg-layer grid gap-4')}>
            <div className="flex items-center justify-between gap-1 h-7">
              <Heading noMargin>{pagerLabel}</Heading>
              {isValidButInTheFutureOrPast ? (
                <Button accentColor="primary" href={currentHref}>
                  <Calendar />
                  Back to Current Month
                </Button>
              ) : (
                <Pager
                  className="-mr-4"
                  nextHref={nextHref}
                  previousHref={previousHref}
                />
              )}
            </div>
            {hasSummaryVisible && (
              <TransactionListWithMonthlySummary
                filterOptions={filterOptions}
              />
            )}
          </div>
        </div>
        <GroupedTransactionList items={transactions} />
      </div>
    </div>
  );
};
