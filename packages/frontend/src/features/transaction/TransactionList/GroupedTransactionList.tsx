import clsx from 'clsx';
import { ListPlus } from 'lucide-react';
import { FC } from 'react';

import { TransactionList } from './TransactionList';

import { TransactionListItemDto } from '$api/generated/financerApi';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { DATE_FORMAT, DateService } from '$services/DateService';

type GroupedTransactionListProps = {
  items: TransactionListItemDto[];
  className?: string;
};

const getGroupLabel = (groupLabel: string) => {
  if (groupLabel === 'Upcoming') {
    return groupLabel;
  }

  const dt = new DateService(groupLabel);

  if (dt.isToday()) {
    return 'Today';
  }

  if (dt.isYesterday()) {
    return 'Yesterday';
  }

  return dt.format(DATE_FORMAT.MONTH_WITH_DATE_LONG);
};

const endOfTodayDate = new DateService().getDate().endOf('day');

export const GroupedTransactionList: FC<GroupedTransactionListProps> = async ({
  items,
  className,
}) => {
  const groupedTransactions = Object.entries(
    Object.groupBy(items, ({ date }) => {
      const dt = new DateService(date).getDate();

      if (dt > endOfTodayDate) {
        return 'Upcoming';
      }

      return dt.toISODate() as string;
    }),
  ).map(([date, data]) => ({ date, data: data || [] }));

  if (groupedTransactions.length === 0) {
    return (
      <InfoMessageBlock title="No Transactions Added" Icon={ListPlus}>
        Your transactions will appear here. <br />
        Add one to begin tracking.
      </InfoMessageBlock>
    );
  }

  return (
    <section className={clsx('grid gap-6', className)}>
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
