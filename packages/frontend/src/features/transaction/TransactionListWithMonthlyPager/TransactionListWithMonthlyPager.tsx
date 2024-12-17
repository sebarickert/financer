import clsx from 'clsx';
import { parse } from 'date-fns';
import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { GroupedTransactionList } from '../TransactionList/GroupedTransactionList';

import { TransactionListWithMonthlySummary } from './TransactionListWithMonthlySummary';

import { TransactionType } from '$api/generated/financerApi';
import { Pager } from '$blocks/Pager';
import { monthNames } from '$constants/months';
import { Heading } from '$elements/Heading';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/TransactionService';
import {
  DateFormat,
  formatDate,
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
  queryDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
}) => {
  const firstTransaction = await TransactionService.getFirstByType(
    type as null,
    additionalFilterOptions,
  );
  const lastTransaction = await TransactionService.getLatestByType(
    type as null,
    additionalFilterOptions,
  );

  const firstTransactionDate = new Date(firstTransaction?.date ?? new Date());
  const firstAvailableTransaction =
    firstTransactionDate > currentDate ? currentDate : firstTransactionDate;

  const lastTransactionDate = new Date(lastTransaction?.date ?? new Date());
  const lastAvailableTransaction =
    lastTransactionDate < currentDate ? currentDate : lastTransactionDate;

  if (!isValidYearMonth(queryDate)) {
    redirect(
      `?date=${currentYear}-${String(currentMonth).padStart(2, '0')}`,
      RedirectType.replace,
    );
  }

  const [year, month] = queryDate.split('-').map(Number);

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

  const parsedQueryDate = parse(queryDate, 'yyyy-MM', new Date());

  const parsedFirstAvailableTransaction = parse(
    formatDate(firstAvailableTransaction, DateFormat.yearMonth),
    'yyyy-MM',
    new Date(),
  );

  const hasValidMonth =
    parsedQueryDate >= parsedFirstAvailableTransaction &&
    parsedQueryDate <= lastAvailableTransaction;

  if (!hasValidMonth) {
    redirect(
      `?date=${currentYear}-${String(currentMonth).padStart(2, '0')}`,
      RedirectType.replace,
    );
  }

  const hasPreviousMonth =
    previousMonth.date >= parsedFirstAvailableTransaction;
  const hasNextMonth = nextMonth.date <= lastAvailableTransaction;

  const previousHref = hasPreviousMonth
    ? `?date=${previousMonth.year}-${String(previousMonth.month).padStart(2, '0')}`
    : undefined;
  const nextHref = hasNextMonth
    ? `?date=${nextMonth.year}-${String(nextMonth.month).padStart(2, '0')}`
    : undefined;

  const pagerLabel = `${monthNames[month - 1]} ${year}`;
  const hasSummaryVisible = isSummaryVisible && transactions.length > 0;

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className={clsx('grid gap-6')}>
        <div data-slot="transaction-list-summary">
          <div className={clsx('p-6 rounded-md bg-layer grid gap-4')}>
            <div className="flex items-center justify-between gap-1 h-7">
              <Heading noMargin>{pagerLabel}</Heading>
              <Pager
                className="-mr-4"
                nextHref={nextHref}
                previousHref={previousHref}
              />
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
