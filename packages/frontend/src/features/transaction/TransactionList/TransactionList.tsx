import clsx from 'clsx';
import { isToday, isYesterday } from 'date-fns';
import { FC } from 'react';

import { TransactionListItem } from './TransactionListItem';

import { TransactionType } from '$api/generated/financerApi';
import { List } from '$blocks/List';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';
import { DateFormat, formatDate } from '$utils/formatDate';

type TransactionListProps = {
  className?: string;
  filterOptions?: TransactionListOptions;
  type?: TransactionType | null;
  hasStickyHeader?: boolean;
};

const getGroupLabel = (date: Date) => {
  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return formatDate(date, DateFormat.monthWithDateShort);
};

export const TransactionList: FC<TransactionListProps> = async ({
  filterOptions = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  className,
  type = null,
  hasStickyHeader,
}) => {
  const transactionData = await TransactionService.getAllByType(type as null, {
    ...filterOptions,
  });

  if (transactionData.length === 0) {
    return (
      <div className={clsx(className)}>
        <p className="text-center theme-text-primary">
          Your transactions will appear here. <br />
          Add one to get started.
        </p>
      </div>
    );
  }

  return (
    <section className={clsx('grid gap-8', className)}>
      {transactionData.map((group) => (
        <List
          key={group.date}
          label={getGroupLabel(group.date as unknown as Date)}
          hasStickyHeader={hasStickyHeader}
        >
          {group.data.map((row) => (
            <TransactionListItem key={row.id} {...row} />
          ))}
        </List>
      ))}
    </section>
  );
};
