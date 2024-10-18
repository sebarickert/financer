import clsx from 'clsx';
import { FC, useState } from 'react';

import { TransactionTypeSwitcherItem } from './TransactionTypeSwitcherItem';

import { TransactionType } from '$api/generated/financerApi';
import { IconName } from '$elements/Icon';

type TransactionActionsProps = {
  className?: string;
  onTransactionTypeChange?(type: TransactionType): void;
};

const switcherItems = [
  {
    children: 'Income',
    icon: 'ArrowDownTrayIcon' as IconName,
    value: TransactionType.Income,
  },
  {
    children: 'Expense',
    icon: 'ArrowUpTrayIcon' as IconName,
    value: TransactionType.Expense,
  },
  {
    children: 'Transfer',
    icon: 'ArrowsRightLeftIcon' as IconName,
    value: TransactionType.Transfer,
  },
];

export const TransactionTypeSwitcher: FC<TransactionActionsProps> = ({
  className = '',
  onTransactionTypeChange,
}) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.Expense,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTransactionTypeChange?.(event.target.value as TransactionType);
    setTransactionType(event.target.value as TransactionType);
  };

  return (
    <div className={clsx('', className)}>
      <ul className="grid items-center justify-center grid-cols-3">
        {switcherItems.map((switcherItem) => (
          <li key={switcherItem.value}>
            <TransactionTypeSwitcherItem
              {...switcherItem}
              onChange={handleChange}
              name="transactionTypeSwitcher"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
