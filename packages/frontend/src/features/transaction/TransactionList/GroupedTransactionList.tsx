import clsx from 'clsx';
import { endOfToday, isToday, isYesterday } from 'date-fns';
import { FC } from 'react';

import { TransactionList } from './TransactionList';

import { TransactionListItemDto } from '$api/generated/financerApi';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import { DateFormat, formatDate } from '$utils/formatDate';

type GroupedTransactionListProps = {
  items: TransactionListItemDto[];
  className?: string;
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

export const GroupedTransactionList: FC<GroupedTransactionListProps> = async ({
  items,
  className,
}) => {
  const groupedTransactions = Object.entries(
    Object.groupBy(items, ({ date }) => {
      if (new Date(date) > endOfTodayDate) {
        return 'Upcoming';
      }

      return new Date(date).toISOString().split('T')[0];
    }),
  ).map(([date, data]) => ({ date, data: data || [] }));

  if (groupedTransactions.length === 0) {
    return (
      <EmptyContentBlock title="No Transactions Added" icon="PlusIcon">
        Your transactions will appear here. <br />
        Add one to begin tracking.
      </EmptyContentBlock>
    );
  }

  return (
    <section className={clsx('grid gap-8', className)}>
      {groupedTransactions.map((group) => (
        <TransactionList
          key={group.date}
          label={getGroupLabel(group.date)}
          items={group.data}
        />
      ))}
    </section>
  );
};
