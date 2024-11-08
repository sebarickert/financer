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

  const pageVisibleYear = filterOptions.year;
  const pageVisibleMonth = monthNames[filterOptions.month - 1];
  const pagerLabel = `${pageVisibleMonth} ${pageVisibleYear}`;

  return (
    <section className={clsx('flex flex-col', className)}>
      <Pager
        pagerOptions={pagerOptions}
        className="justify-end mb-4"
        isStatusHidden
      >
        {pagerLabel}
      </Pager>
      {isSummaryVisible && (
        <TransactionListWithMonthlySummary filterOptions={filterOptions} />
      )}
      <TransactionList
        filterOptions={filterOptions}
        type={type}
        className={clsx({ ['mt-8']: isSummaryVisible })}
        hasStickyHeader
      />
    </section>
  );
};
