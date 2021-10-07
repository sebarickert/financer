import React from "react";
import AccountsListRow, { IAccountsListRowProps } from "./accounts-list.row";

interface IAccountsListProps {
  label?: string;
  rows: IAccountsListRowProps[];
  className?: string;
}

const AccountsList = ({
  label,
  rows,
  className,
}: IAccountsListProps): JSX.Element => {
  return (
    <section className={`${className}`}>
      {label && (
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mt-8 mb-4">
          {label}
        </h2>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {rows.map(
          ({ balanceAmount, accountType, label: rowLabel, link, id }) => (
            <li>
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

export default AccountsList;
