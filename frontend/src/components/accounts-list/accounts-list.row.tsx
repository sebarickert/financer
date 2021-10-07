import React from "react";
import { NavLink } from "react-router-dom";

export interface IAccountsListRowProps {
  accountType: string;
  balanceAmount: string;
  label: string;
  link?: string;
  id: string;
}

const AccountsListRow = ({
  accountType,
  balanceAmount,
  label,
  link,
}: IAccountsListRowProps): JSX.Element => {
  return (
    <article
      className="relative group bg-white focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border overflow-hidden hover:bg-gray-50 h-full p-6"
      data-test-id="account-row"
    >
      <dl className="flex flex-col justify-between h-full space-y-4">
        <div>
          <dt className="sr-only">Account type</dt>
          <dd className="text-xs font-semibold uppercase leading-5 text-gray-500">
            {accountType}
          </dd>
          <dt className="sr-only">Account name</dt>
          <dd className="text-lg font-bold tracking-tight">
            {link ? (
              <NavLink to={link} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {label}
              </NavLink>
            ) : (
              { label }
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase leading-5 text-gray-500">
            Balance
          </dt>
          <dd className="text-xl font-bold tracking-tight">{balanceAmount}</dd>
        </div>
      </dl>
      {link && (
        <span
          className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
          </svg>
        </span>
      )}
    </article>
  );
};

export default AccountsListRow;
