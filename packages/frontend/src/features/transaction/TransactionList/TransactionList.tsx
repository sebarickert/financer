import clsx from 'clsx';
import { ListPlus } from 'lucide-react';
import { FC } from 'react';

import { TransactionListItem } from './TransactionListItem';

import { TransactionListItemDto } from '$api/generated/financerApi';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
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
      <InfoMessageBlock title="No Transactions Added" Icon={ListPlus}>
        Your transactions will appear here. <br />
        Add one to begin tracking.
      </InfoMessageBlock>
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
