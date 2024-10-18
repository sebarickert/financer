import clsx from 'clsx';
import { FC } from 'react';

import { TransactionTypeSwitcherItem } from './TransactionTypeSwitcherItem';

import { TransactionType } from '$api/generated/financerApi';
import { IconName } from '$elements/Icon';

type TransactionActionsProps = {
  className?: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  defaultChecked?: TransactionType;
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
  onChange,
  defaultChecked = TransactionType.Expense,
}) => {
  return (
    <div className={clsx('', className)}>
      <ul className="grid items-center justify-center grid-cols-3">
        {switcherItems.map((switcherItem) => (
          <li key={switcherItem.value}>
            <TransactionTypeSwitcherItem
              {...switcherItem}
              onChange={onChange}
              name="transactionTypeSwitcher"
              isChecked={defaultChecked === switcherItem.value}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
