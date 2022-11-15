import { AccountType } from '@local/types';
import { NavLink } from 'react-router-dom';

export interface AccountsListRowProps {
  accountType: string;
  type: AccountType;
  balanceAmount: string;
  label: string;
  link?: string;
  id: string;
}

export const AccountsListRow = ({
  accountType,
  balanceAmount,
  label,
  link,
}: AccountsListRowProps): JSX.Element => {
  return (
    <article
      className="relative h-full p-6 overflow-hidden bg-white border rounded-lg group focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-50"
      data-testid="account-row"
    >
      <dl className="flex flex-col justify-between h-full space-y-4">
        <div>
          <dt className="sr-only">Account type</dt>
          <dd className="text-xs font-semibold leading-5 text-gray-500 uppercase">
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
              label
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold leading-5 text-gray-500 uppercase">
            Balance
          </dt>
          <dd className="text-xl font-bold tracking-tight">{balanceAmount}</dd>
        </div>
      </dl>
      {link && (
        <span
          className="absolute text-gray-300 pointer-events-none top-6 right-6 group-hover:text-gray-400"
          aria-hidden="true"
        >
          <svg
            className="w-6 h-6"
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
