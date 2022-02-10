import React from 'react';
import { NavLink } from 'react-router-dom';

interface IDashboardAccountsItemProps {
  balanceAmount: string;
  label: string;
  className?: string;
  link?: string;
}

export const DashboardAccountsItem = ({
  label,
  balanceAmount,
  className = '',
  link,
}: IDashboardAccountsItemProps): JSX.Element => {
  return (
    <li
      className={`relative bg-white px-6 py-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500  grid grid-cols-[1fr,auto] gap-2 justify-between hover:bg-gray-50 ${className}`}
    >
      <span className="truncate">
        {link ? (
          <NavLink
            to={link}
            className="focus:outline-none"
            aria-label={`Go to ${label} account page`}
            title={`Go to ${label} account page`}
          >
            <span className="absolute inset-0" aria-hidden="true" />
            {label}
          </NavLink>
        ) : (
          label
        )}
      </span>
      <span>{balanceAmount}</span>
    </li>
  );
};
