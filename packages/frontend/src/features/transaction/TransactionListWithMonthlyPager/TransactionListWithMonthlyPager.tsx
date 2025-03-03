import clsx from 'clsx';
import { RedirectType, redirect } from 'next/navigation';
import { FC } from 'react';

import { GroupedTransactionList } from '../TransactionList/GroupedTransactionList';

import { TransactionListWithMonthlySummary } from './TransactionListWithMonthlySummary';

import { TransactionType } from '@/api/ssr-financer-api';
import { Card } from '@/blocks/Card/Card';
import { Pager } from '@/blocks/Pager';
import { Heading } from '@/elements/Heading';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import {
  TransactionListOptions,
  TransactionService,
} from '@/ssr/api/TransactionService';

const currentDate = new DateService().getDate();
const currentYear = currentDate.year;
const currentMonth = currentDate.month;

interface TransactionListingWithMonthlyPagerProps {
  className?: string;
  isSummaryVisible?: boolean;
  filterOptions?: TransactionListOptions;
  type?: TransactionType | null;
  queryDate?: string;
}

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

  const firstTransactionDate = new DateService(firstTransaction.date);
  const firstAvailableTransaction = firstTransactionDate.isAfter(currentDate)
    ? currentDate
    : firstTransactionDate.getDate();

  const lastTransactionDate = new DateService(lastTransaction.date);
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

  const previousMonth = new DateService(
    DateService.createFromYearAndMonth(year, month),
  ).getPreviousMonth();
  const nextMonth = new DateService(
    DateService.createFromYearAndMonth(year, month),
  ).getNextMonth();

  const parsedQueryDate = DateService.parseFormat(
    queryDate,
    DATE_FORMAT.YEAR_MONTH,
  );

  const isQueryDateWithinTransactionRange =
    parsedQueryDate >= firstAvailableTransaction.startOf('month') &&
    parsedQueryDate <= lastAvailableTransaction.endOf('month');

  if (!isQueryDateWithinTransactionRange) {
    redirect(
      `?date=${currentYear}-${String(currentMonth).padStart(2, '0')}`,
      RedirectType.replace,
    );
  }

  const hasPreviousMonth =
    previousMonth.date >= firstAvailableTransaction.startOf('month');
  const hasNextMonth =
    nextMonth.date <= lastAvailableTransaction.endOf('month');

  const previousHref = hasPreviousMonth
    ? `?date=${previousMonth.year}-${String(previousMonth.month).padStart(2, '0')}`
    : undefined;
  const nextHref = hasNextMonth
    ? `?date=${nextMonth.year}-${String(nextMonth.month).padStart(2, '0')}`
    : undefined;

  const pagerLabel = new DateService(
    DateService.createFromYearAndMonth(year, month),
  ).format(DATE_FORMAT.MONTH_WITH_YEAR_LONG);
  const hasSummaryVisible = isSummaryVisible && transactions.length > 0;

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className={clsx('grid gap-4')}>
        <div data-slot="transaction-list-summary">
          <Card className={clsx('grid gap-4')}>
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
          </Card>
        </div>
        <GroupedTransactionList items={transactions} />
      </div>
    </div>
  );
};
