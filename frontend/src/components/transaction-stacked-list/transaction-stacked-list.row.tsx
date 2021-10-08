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
}: ITransactionStackedListRowProps): JSX.Element => {
  const iconTypeMapping: {
    [key in 'expense' | 'income' | 'transfer']: IconName;
  } = {
    expense: 'download',
    income: 'upload',
    transfer: 'switch-horizontal',
  };

  return (
    <li>
      <article className="relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border grid grid-cols-[auto,1fr,auto] gap-4 hover:bg-gray-50">
        <div>
          <span
            className={`rounded-lg inline-flex p-3 text-white ring-4 ring-white ${
              transactionType === 'transfer' && 'bg-blue-financer'
            } ${transactionType === 'income' && 'bg-green-600'} ${
              transactionType === 'expense' && 'bg-red-600'
            }`}
          >
            <Icon type={iconTypeMapping[transactionType]} />
          </span>
        </div>
        <div className="flex flex-col justify-between overflow-hidden">
          <h2 className="text-base font-semibold truncate">
            <NavLink to={link} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {label}
            </NavLink>
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {transactionCategories}
          </p>
        </div>
        <div className="flex flex-col justify-between text-right">
          <p
            className={`text-base font-semibold truncate ${
              transactionType === 'income' && 'text-green-600'
            } ${transactionType === 'expense' && 'text-red-600'}`}
          >
            {transactionType === 'income' && '+ '}
            {transactionType === 'expense' && '- '}
            {transactionAmount}
          </p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </article>
    </li>
  );
};
