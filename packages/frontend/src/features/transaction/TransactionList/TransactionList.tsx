import clsx from 'clsx';
import { endOfToday, isToday, isYesterday } from 'date-fns';
import { FC } from 'react';

import { TransactionListItem } from './TransactionListItem';

import { TransactionType } from '$api/generated/financerApi';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
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

const getGroupLabel = (groupLabel: string) => {
  if (groupLabel === 'Upcoming') {
    return groupLabel;
  }

  if (isToday(new Date(groupLabel))) {
    return 'Today';
  }

  if (isYesterday(new Date(groupLabel))) {
    return 'Yesterday';
  }

  return formatDate(new Date(groupLabel), DateFormat.monthWithDateShort);
};

const endOfTodayDate = endOfToday();

export const TransactionList: FC<TransactionListProps> = async ({
  filterOptions = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  },
  className,
  type = null,
  hasStickyHeader,
}) => {
  const transactions = await TransactionService.getAllByType(type as null, {
    ...filterOptions,
  });

  if (transactions.length === 0) {
    return (
      <EmptyContentBlock title="No Transactions Added" icon="PlusIcon">
        Your transactions will appear here. <br />
        Add one to begin tracking.
      </EmptyContentBlock>
    );
  }

  const groupedTransactions = Object.entries(
    Object.groupBy(transactions, ({ date }) => {
      if (new Date(date) > endOfTodayDate) {
        return 'Upcoming';
      }

      return new Date(date).toISOString().split('T')[0];
    }),
  ).map(([date, data]) => ({ date, data: data || [] }));

  return (
    <section className={clsx('grid gap-8', className)}>
      {groupedTransactions.map((group) => (
        <List
          key={group.date}
          label={getGroupLabel(group.date)}
          hasStickyHeader={hasStickyHeader}
          testId="transaction-list"
          hasItemRoundness
        >
          {group.data.map((row) => (
            <TransactionListItem key={row.id} {...row} />
          ))}
        </List>
      ))}
    </section>
  );
};
