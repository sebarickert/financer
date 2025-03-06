import clsx from 'clsx';
import { FC } from 'react';

import { TransactionTypeSwitcherItem } from './TransactionTypeSwitcherItem';

import { TransactionType } from '@/api/ssr-financer-api';

interface TransactionActionsProps {
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultChecked?: TransactionType;
  name?: string;
}

const switcherItems = [
  {
    children: 'Income',
    value: TransactionType.INCOME,
  },
  {
    children: 'Expense',
    value: TransactionType.EXPENSE,
  },
  {
    children: 'Transfer',
    value: TransactionType.TRANSFER,
  },
];

export const TransactionTypeSwitcher: FC<TransactionActionsProps> = ({
  className = '',
  onChange,
  defaultChecked = TransactionType.EXPENSE,
  name,
}) => {
  return (
    <div
      className={clsx('', className)}
      data-testid="transaction-type-switcher"
    >
      <ul className="grid items-center justify-center grid-cols-3 gap-1 p-1 rounded-md bg-layer">
        {switcherItems.map((switcherItem) => (
          <li key={switcherItem.value}>
            <TransactionTypeSwitcherItem
              {...switcherItem}
              onChange={onChange}
              name={name ?? 'transaction-type-switcherItem'}
              isChecked={defaultChecked === switcherItem.value}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
