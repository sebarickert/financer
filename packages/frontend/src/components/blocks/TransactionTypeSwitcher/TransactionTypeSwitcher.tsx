import clsx from 'clsx';
import { FC } from 'react';

import { TransactionTypeSwitcherItem } from './TransactionTypeSwitcherItem';

import { TransactionType } from '$api/generated/financerApi';

type TransactionActionsProps = {
  className?: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  defaultChecked?: TransactionType;
  name?: string;
};

const switcherItems = [
  {
    children: 'Income',
    value: TransactionType.Income,
  },
  {
    children: 'Expense',
    value: TransactionType.Expense,
  },
  {
    children: 'Transfer',
    value: TransactionType.Transfer,
  },
];

export const TransactionTypeSwitcher: FC<TransactionActionsProps> = ({
  className = '',
  onChange,
  defaultChecked = TransactionType.Expense,
  name,
}) => {
  return (
    <div className={clsx('', className)} data-testid="transactionTypeSwitcher">
      <ul className="grid items-center justify-center grid-cols-3 gap-0.5 p-1 rounded-lg bg-gray">
        {switcherItems.map((switcherItem) => (
          <li key={switcherItem.value}>
            <TransactionTypeSwitcherItem
              {...switcherItem}
              onChange={onChange}
              name={name ?? 'transactionTypeSwitcherItem'}
              isChecked={defaultChecked === switcherItem.value}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
