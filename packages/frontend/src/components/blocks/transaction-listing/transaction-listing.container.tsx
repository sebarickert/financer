import { FC } from 'react';

import { parseRowFromTransaction } from './parse-row-from-transaction';
import { TransactionListing } from './transaction-listing';

import { TransactionType } from '$api/generated/financerApi';
import { PagerService } from '$blocks/pager/pager.service';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';

export interface TransactionListingContainerProps {
  isPagerHidden?: boolean;
  className?: string;
  filterOptions?: TransactionListOptions;
  type?: TransactionType | null;
  onPageChange?: (page: number) => void;
}

export const TransactionListingContainer: FC<
  TransactionListingContainerProps
> = async ({
  isPagerHidden,
  filterOptions = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  className,
  type = null,
  onPageChange,
}) => {
  const transactionData = await TransactionService.getAllByType(type as null, {
    ...filterOptions,
    page: PagerService.getCurrentPage(),
  });

  onPageChange?.(transactionData.currentPage ?? 1);

  const rows = await Promise.all(
    transactionData.data.map(parseRowFromTransaction),
  );

  return (
    <TransactionListing
      rows={rows}
      pagerOptions={{ ...PagerService.getPagerOptions(transactionData) }}
      className={className}
      isPagerHidden={isPagerHidden}
    />
  );
};
