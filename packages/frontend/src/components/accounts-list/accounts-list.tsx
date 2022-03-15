import React from 'react';

import { Heading } from '../heading/heading';

import { AccountsListRow, IAccountsListRowProps } from './accounts-list.row';

interface IAccountsListProps {
  label?: string;
  rows: IAccountsListRowProps[];
  className?: string;
}

export const AccountsList = ({
  label,
  rows,
  className,
}: IAccountsListProps): JSX.Element => {
  return (
    <section className={`${className}`}>
      {label && <Heading className="mb-4">{label}</Heading>}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {rows.map(
          ({ balanceAmount, accountType, label: rowLabel, link, id }) => (
            <li key={id}>
              <AccountsListRow
                label={rowLabel}
                balanceAmount={balanceAmount}
                accountType={accountType}
                link={link}
                id={id}
                key={id}
              />
            </li>
          )
        )}
      </ul>
    </section>
  );
};
