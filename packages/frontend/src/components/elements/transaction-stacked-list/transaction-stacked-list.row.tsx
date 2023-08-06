import clsx from 'clsx';
import Link from 'next/link';

import { IconName, Icon } from '../icon/icon';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export interface TransactionStackedListRowProps {
  transactionCategories?: string;
  transactionAmount: string;
  date: string;
  label: string;
  link: string;
  transactionType: TransactionType;
  id: string;
}

export const TransactionStackedListRow = ({
  transactionCategories,
  transactionAmount,
  date,
  label,
  link,
  transactionType,
  id,
}: TransactionStackedListRowProps): JSX.Element => {
  const iconTypeMapping: {
    [key in 'expense' | 'income' | 'transfer']: IconName;
  } = {
    expense: IconName.upload,
    income: IconName.download,
    transfer: IconName.switchHorizontal,
  };

  return (
    <li data-testid={id} className="group">
      <Link
        href={link}
        className={`relative flex gap-4 items-center focus-within:bg-gray-dark hover:bg-gray-dark overflow-hidden pl-4 lg:rounded-md`}
      >
        <span className="inline-flex items-center justify-center border rounded-full bg-gray h-11 w-11 border-gray-dark">
          <Icon
            type={iconTypeMapping[transactionType]}
            className={`stroke-charcoal flex-shrink-0 pointer-events-none`}
          />
        </span>
        <span className="text-base items-center gap-4 flex justify-between font-medium tracking-tight py-5 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-dark after:bottom-0 flex-1 overflow-hidden group-last:after:hidden">
          <span>
            <span className="grid">
              <span className="text-black truncate">{label}</span>
              <span className="text-sm font-normal tracking-tight truncate text-gray-darkest">
                <span className="sr-only">Balance: </span>
                <span>
                  <span className="sr-only">Date: </span>
                  {date}
                </span>
                {transactionCategories && (
                  <>
                    {' - '}
                    <span>
                      <span className="sr-only">Categories: </span>
                      {transactionCategories}
                    </span>
                  </>
                )}
              </span>
            </span>
          </span>
          <span
            className={clsx('flex-shrink-0 ml-auto', {
              ['text-green']: transactionType === 'income',
              ['text-red']: transactionType === 'expense',
            })}
          >
            {transactionType === 'income' && '+ '}
            {transactionType === 'expense' && '- '}
            {transactionAmount}
          </span>
          <Icon
            type={IconName.chevronRight}
            className="flex-shrink-0 pointer-events-none stroke-gray-darkest"
          />
        </span>
      </Link>
    </li>
  );
};
