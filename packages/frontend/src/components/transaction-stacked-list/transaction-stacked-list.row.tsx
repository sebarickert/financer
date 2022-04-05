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
    expense: 'upload',
    income: 'download',
    transfer: 'switch-horizontal',
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
            type={'chevron-right'}
            className=" stroke-gray-300 flex-shrink-0 pointer-events-none"
          />
        </span>
      </NavLink>
      {/* <article className="relative bg-white p-4 md:p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 grid grid-cols-[auto,1fr,auto] gap-3 sm:gap-4 hover:bg-gray-50 items-center">
          <div className="">
            <span
              className={`rounded-md sm:rounded-lg inline-flex p-2 sm:p-3 text-white ring-4 ring-white ${
                transactionType === 'transfer' && 'bg-blue-financer'
              } ${transactionType === 'income' && 'bg-emerald-600'} ${
                transactionType === 'expense' && 'bg-red-600'
              }`}
            >
              <Icon
                type={iconTypeMapping[transactionType]}
                className="h-5 w-5 sm:h-6 sm:w-6"
              />
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
        </article> */}
    </li>
  );
};
