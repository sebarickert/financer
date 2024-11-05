import clsx from 'clsx';
import { FC } from 'react';

import { TransactionListItem } from './TransactionListItem';

import { TransactionType } from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { Pager } from '$blocks/pager/pager';
import { PagerService } from '$blocks/pager/pager.service';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';
import { parseRowFromTransaction } from '$utils/transaction/parseRowFromTransaction';

type TransactionListProps = {
  isPagerHidden?: boolean;
  className?: string;
  filterOptions?: TransactionListOptions;
  type?: TransactionType | null;
  onPageChange?: (page: number) => void;
};

export const TransactionList: FC<TransactionListProps> = async ({
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

  if (rows.length === 0) {
    return (
      <div className={clsx(className)}>
        <p className="text-center theme-text-primary">
          Your transactions will appear here. <br />
          Add one to get started.
        </p>
      </div>
    );
  }

  const pagerOptions = PagerService.getPagerOptions(transactionData);

  return (
    <section className={clsx(className)}>
      <List testId="transaction-list">
        {rows.map((row) => (
          <TransactionListItem key={row.id} {...row} />
        ))}
      </List>
      {pagerOptions.pageCount &&
        pagerOptions.pageCount > 1 &&
        !isPagerHidden && (
          <Pager className="mt-4" pagerOptions={pagerOptions} />
        )}
    </section>
  );
};
