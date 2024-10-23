import clsx from 'clsx';
import { FC } from 'react';

import { AccountDto } from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { Link } from '$elements/Link';
import { formatCurrency } from '$utils/formatCurrency';

export interface AccountListingItem {
  balanceAmount: string;
  accountName: string;
  url: string;
  id: string;
}

type AccountListProps = {
  label?: string;
  accounts: AccountDto[];
  className?: string;
};

export const AccountList: FC<AccountListProps> = ({
  label,
  accounts,
  className,
}) => {
  if (accounts.length === 0) return null;

  return (
    <List label={label} className={clsx(className)} testId="account-list">
      {accounts.map(({ id, balance, name }) => {
        return (
          <Link
            href={`/accounts/${id}`}
            testId="account-row"
            key={id}
            className={clsx(
              'relative px-4 py-5',
              'grid grid-cols-[auto,1fr] items-center gap-2',
              'theme-layer-color-with-hover',
            )}
            transition="slideInFromRight"
          >
            <span className="truncate">{name}</span>
            <span className="text-lg font-medium text-right">
              {formatCurrency(balance)}
            </span>
          </Link>
        );
      })}
    </List>
  );
};
