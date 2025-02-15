import clsx from 'clsx';
import { ListPlus } from 'lucide-react';
import { FC } from 'react';

import { TransactionList } from './TransactionList';

import {
  TransactionListItemDto,
  TransactionType,
} from '$api/generated/financerApi';
import { Card } from '$blocks/Card/Card';
import { CardHeader } from '$blocks/Card/CardHeader';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { Heading } from '$elements/Heading';
import { DATE_FORMAT, DateService } from '$services/DateService';
import { formatCurrency } from '$utils/formatCurrency';

interface GroupedTransactionListProps {
  items: TransactionListItemDto[];
  className?: string;
}

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

export const GroupedTransactionList: FC<GroupedTransactionListProps> = async ({
  items,
  className,
}) => {
  const endOfTodayDate = new DateService().getDate().endOf('day');

  const groupedTransactions = Object.entries(
    Object.groupBy(items, ({ date }) => {
      const dt = new DateService(date).getDate();

      if (dt > endOfTodayDate) {
        return 'Upcoming';
      }

      return dt.toISODate()!;
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
    <div className={clsx('grid gap-4', className)}>
      {groupedTransactions.map((group) => {
        const groupAmount = group.data
          .filter(
            ({ type }) =>
              type === TransactionType.Income ||
              type === TransactionType.Expense,
          )
          .map(({ type, amount }) =>
            type === TransactionType.Expense ? -amount : amount,
          )
          .reduce((acc, curr) => acc + curr, 0);

        return (
          <Card key={group.date} className="pb-0!">
            <CardHeader className="border-b flex justify-between items-center py-4.5!">
              <Heading noMargin className="text-base!">
                {getGroupLabel(group.date)}
              </Heading>
              <p className="text-muted-foreground text-sm">
                {formatCurrency(groupAmount, true)}
              </p>
            </CardHeader>
            <TransactionList
              items={group.data}
              className="-mx-6 [&_[data-slot='list-item']]:first:[&>:not(style)]:rounded-t-none"
            />
          </Card>
        );
      })}
    </div>
  );
};
