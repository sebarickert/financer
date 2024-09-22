import { FC } from 'react';

import { TransactionListingWithMonthlyPagerSummary } from './transaction-listing.with.monthly-pager.summary';

import { TransactionType } from '$api/generated/financerApi';
import { Pager } from '$blocks/pager/pager';
import { PagerService } from '$blocks/pager/pager.service';
import { TransactionListingContainer } from '$blocks/transaction-listing/transaction-listing.container';
import { monthNames } from '$constants/months';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';

interface TransactionListingWithMonthlyPagerProps {
  className?: string;
  isSummaryVisible?: boolean;
  filterOptions?: TransactionListOptions;
  type?: TransactionType | null;
}

export const TransactionListingWithMonthlyPager: FC<
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
    <section className={className}>
      <Pager className="mb-4" pagerOptions={pagerOptions} isStatusHidden>
        {pagerLabel}
      </Pager>
      {isSummaryVisible && (
        <TransactionListingWithMonthlyPagerSummary
          filterOptions={filterOptions}
        />
      )}
      <TransactionListingContainer
        filterOptions={filterOptions}
        className="mt-4"
        type={type}
      />
    </section>
  );
};
