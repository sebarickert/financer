import clsx from 'clsx';
import { FC } from 'react';

import { GroupedTransactionList } from '../TransactionList/GroupedTransactionList';

import { TransactionListWithMonthlySummary } from './TransactionListWithMonthlySummary';

import { TransactionType } from '$api/generated/financerApi';
import { Pager } from '$blocks/pager/pager';
import { PagerService } from '$blocks/pager/pager.service';
import { monthNames } from '$constants/months';
import { Heading } from '$elements/Heading';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/TransactionService';

type TransactionListingWithMonthlyPagerProps = {
  className?: string;
  isSummaryVisible?: boolean;
  filterOptions?: TransactionListOptions;
  type?: TransactionType | null;
};

export const TransactionListWithMonthlyPager: FC<
  TransactionListingWithMonthlyPagerProps
> = async ({
  className = '',
  isSummaryVisible,
  filterOptions: additionalFilterOptions,
  type = null,
}) => {
  const firstTransaction = await TransactionService.getFirstByType();
  const lastTransaction = await TransactionService.getLatestByType();

  const firstAvailableTransaction = new Date(
    firstTransaction?.date ?? new Date(),
  );
  const lastAvailableTransaction = new Date(
    lastTransaction?.date ?? new Date(),
  );
  const pagerOptions = PagerService.getYearMonthPageOptions(
    firstAvailableTransaction,
    lastAvailableTransaction,
  );

  const filterOptions = {
    ...additionalFilterOptions,
    year: PagerService.getCurrentDateFilter().getFullYear(),
    month: PagerService.getCurrentDateFilter().getMonth() + 1,
  };

  const transactions = await TransactionService.getAllByType(type as null, {
    ...filterOptions,
  });

  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];
  const pagerLabel = `${pageVisibleMonth} ${pageVisibleYear}`;

  const hasSummaryVisible = isSummaryVisible && transactions.length > 0;

  return (
    <section className={clsx('flex flex-col', className)}>
      <div className={clsx('grid lg:grid-cols-[minmax(350px,auto)_1fr] gap-6')}>
        <div
          className={clsx(
            'self-baseline lg:sticky lg:top-[calc(var(--gutter-top)+theme(spacing.4))] relative isolate',
          )}
          data-slot="transaction-list-summary"
        >
          <div className={clsx('p-6 rounded-md bg-layer grid gap-4')}>
            <div className="flex items-center justify-between gap-1 h-7">
              <Heading disableResponsiveSizing noMargin>
                {pagerLabel}
              </Heading>
              <Pager
                pagerOptions={pagerOptions}
                isStatusHidden
                className="-mr-4"
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
    </section>
  );
};
