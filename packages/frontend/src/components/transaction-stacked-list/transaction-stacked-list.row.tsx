import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, IconName } from '../icon/icon';

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
      <NavLink
        to={link}
        className={`relative flex gap-4 items-center focus-within:bg-gray-100 hover:bg-gray-100 overflow-hidden pl-4 lg:rounded-md`}
      >
        <Icon
          type={iconTypeMapping[transactionType]}
          className={`stroke-black flex-shrink-0 pointer-events-none`}
        />
        <span className="text-base items-center gap-4 flex justify-between font-semibold tracking-tight py-4 pr-4 after:h-[1px] after:w-full after:absolute after:bg-gray-200 after:bottom-0 flex-1 overflow-hidden group-last:after:hidden">
          <span>
            <span className="grid">
              <span className="truncate">{label}</span>
              <span className="text-sm font-normal text-gray-600 truncate">
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
            className={`flex-shrink-0 ml-auto ${
              transactionType === 'income' && 'text-emerald-600'
            } ${transactionType === 'expense' && 'text-red-600'}`}
          >
            {transactionType === 'income' && '+ '}
            {transactionType === 'expense' && '- '}
            {transactionAmount}
          </span>
          <Icon
            type={IconName.chevronRight}
            className="flex-shrink-0 pointer-events-none stroke-gray-300"
          />
        </span>
      </NavLink>
    </li>
  );
};
