import clsx from 'clsx';
import { FC } from 'react';

import { TransactionList } from '../TransactionList/TransactionList';

import { TransactionListWithMonthlySummary } from './TransactionListWithMonthlySummary';

import { TransactionType } from '$api/generated/financerApi';
import { Pager } from '$blocks/pager/pager';
import { PagerService } from '$blocks/pager/pager.service';
import { monthNames } from '$constants/months';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';

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
  const transaction = await TransactionService.getFirstByType();

  const firstAvailableTransaction = new Date(transaction?.date ?? new Date());
  const pagerOptions = PagerService.getYearMonthPageOptions(
    firstAvailableTransaction,
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
      <div
        className={clsx('', {
          ['grid lg:grid-cols-[minmax(350px,auto),1fr] gap-6']:
            hasSummaryVisible,
        })}
      >
        <div
          className={clsx('', {
            ['self-baseline lg:sticky lg:top-[calc(var(--gutter-top)+theme(spacing.4))] relative isolate']:
              hasSummaryVisible,
            'mb-4': !hasSummaryVisible,
          })}
          data-slot="transaction-list-summary"
        >
          <Pager
            pagerOptions={pagerOptions}
            isStatusHidden
            className={clsx({
              ['absolute top-6 right-6 translate-x-[16px] -translate-y-[12px] gap-0 z-10']:
                hasSummaryVisible,
            })}
          >
            {!hasSummaryVisible ? pagerLabel : undefined}
          </Pager>
          {hasSummaryVisible && (
            <TransactionListWithMonthlySummary filterOptions={filterOptions} />
          )}
        </div>
        <TransactionList filterOptions={filterOptions} type={type} />
      </div>
    </section>
  );
};
