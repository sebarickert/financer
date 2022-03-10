import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, IconName } from '../icon/icon';

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface ITransactionStackedListRowProps {
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
}: ITransactionStackedListRowProps): JSX.Element => {
  const iconTypeMapping: {
    [key in 'expense' | 'income' | 'transfer']: IconName;
  } = {
    expense: 'download',
    income: 'upload',
    transfer: 'switch-horizontal',
  };

  return (
    <li data-testid={id}>
      <article className="relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500  grid grid-cols-[auto,1fr,auto] gap-4 hover:bg-gray-50">
        <div>
          <span
            className={`rounded-lg inline-flex p-3 text-white ring-4 ring-white ${
              transactionType === 'transfer' && 'bg-blue-financer'
            } ${transactionType === 'income' && 'bg-emerald-600'} ${
              transactionType === 'expense' && 'bg-red-600'
            }`}
          >
            <Icon type={iconTypeMapping[transactionType]} />
          </span>
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <h2 className="text-sm sm:text-base font-semibold truncate">
            <NavLink to={link} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {label}
            </NavLink>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
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
          </p>
        </div>
        <div className="flex items-center">
          <p
            className={`text-sm sm:text-base font-semibold ${
              transactionType === 'income' && 'text-emerald-600'
            } ${transactionType === 'expense' && 'text-red-600'}`}
          >
            {transactionType === 'income' && '+ '}
            {transactionType === 'expense' && '- '}
            {transactionAmount}
          </p>
        </div>
      </article>
    </li>
  );
};
