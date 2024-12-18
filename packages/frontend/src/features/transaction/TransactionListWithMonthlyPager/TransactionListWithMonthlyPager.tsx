import clsx from 'clsx';
import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { GroupedTransactionList } from '../TransactionList/GroupedTransactionList';

import { TransactionListWithMonthlySummary } from './TransactionListWithMonthlySummary';

import { TransactionType } from '$api/generated/financerApi';
import { Pager } from '$blocks/Pager';
import { monthNames } from '$constants/months';
import { Heading } from '$elements/Heading';
import { DATE_FORMAT, DateService } from '$services/DateService';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/TransactionService';

const currentDate = new DateService().getDate();
const currentYear = currentDate.year;
const currentMonth = currentDate.month;

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

  const firstTransactionDate = new DateService(firstTransaction?.date);
  const firstAvailableTransaction = firstTransactionDate.isAfter(currentDate)
    ? currentDate
    : firstTransactionDate.getDate();

  const lastTransactionDate = new DateService(lastTransaction?.date);
  const lastAvailableTransaction = lastTransactionDate.isBefore(currentDate)
    ? currentDate
    : lastTransactionDate.getDate();

  if (!DateService.isValidYearMonth(queryDate)) {
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

  const previousMonth = DateService.getPreviousMonth(
    DateService.createFromYearAndMonth(year, month),
  );
  const nextMonth = DateService.getNextMonth(
    DateService.createFromYearAndMonth(year, month),
  );

  const parsedQueryDate = DateService.parseFormat(
    queryDate,
    DATE_FORMAT.YEAR_MONTH,
  );

  const hasValidMonth =
    parsedQueryDate >= firstAvailableTransaction &&
    parsedQueryDate <= lastAvailableTransaction;

  if (!hasValidMonth) {
    redirect(
      `?date=${currentYear}-${String(currentMonth).padStart(2, '0')}`,
      RedirectType.replace,
    );
  }

  const hasPreviousMonth = previousMonth.date >= firstAvailableTransaction;
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
