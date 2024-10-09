import clsx from 'clsx';

import { TransactionActionsItem } from './transaction-actions.item';

import { IconName } from '$elements/icon/icon.new';
import { TransitionType } from '$utils/transitionAnimations';

interface TransactionActionsProps {
  className?: string;
  transition?: TransitionType;
  onClick?(param: boolean): void;
}

const actionItems = [
  {
    label: 'Income',
    icon: 'ArrowDownTrayIcon' as IconName,
    url: '/statistics/incomes/add',
    ariaLabel: 'Add new income transaction',
  },
  {
    label: 'Expense',
    icon: 'ArrowUpTrayIcon' as IconName,
    url: '/statistics/expenses/add',
    ariaLabel: 'Add new expense transaction',
  },
  {
    label: 'Transfer',
    icon: 'ArrowsRightLeftIcon' as IconName,
    url: '/statistics/transfers/add',
    ariaLabel: 'Add new transfer transaction',
  },
];

export const TransactionActions = ({
  className = '',
  onClick = () => {},
  transition,
}: TransactionActionsProps) => {
  return (
    <div className={clsx('', { [className]: true })}>
      <nav className="">
        <ul className="grid items-center justify-center grid-cols-3">
          {actionItems.map((actionItem) => {
            return (
              <li key={actionItem.url}>
                <TransactionActionsItem
                  {...actionItem}
                  transition={transition}
                  onClick={() => onClick(false)}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
