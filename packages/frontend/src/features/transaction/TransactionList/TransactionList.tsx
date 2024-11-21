import clsx from 'clsx';
import { FC } from 'react';

import { TransactionListItem } from './TransactionListItem';

import { TransactionListItemDto } from '$api/generated/financerApi';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import { List } from '$blocks/List';

type TransactionListProps = {
  items: TransactionListItemDto[];
  className?: string;
  label?: string;
};

export const TransactionList: FC<TransactionListProps> = async ({
  label,
  items,
  className,
}) => {
  if (items.length === 0) {
    return (
      <EmptyContentBlock title="No Transactions Added" icon="PlusIcon">
        Your transactions will appear here. <br />
        Add one to begin tracking.
      </EmptyContentBlock>
    );
  }

  return (
    <List label={label} testId="transaction-list" className={clsx(className)}>
      {items.map((row) => (
        <TransactionListItem {...row} key={row.id} />
      ))}
    </List>
  );
};
