import clsx from 'clsx';
import { FC } from 'react';

import { AccountDto } from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { ACCOUNT_TYPE_MAPPING } from '$constants/account/ACCOUNT_TYPE_MAPPING';
import { Link } from '$elements/Link';
import { formatCurrency } from '$utils/formatCurrency';

export type AccountListingItem = {
  balanceAmount: string;
  accountName: string;
  url: string;
  id: string;
};

type AccountListProps = {
  label?: string;
  accounts: AccountDto[] | undefined;
  className?: string;
};

export const AccountList: FC<AccountListProps> = ({
  label,
  accounts = [],
  className,
}) => {
  if (accounts.length === 0) return null;

  return (
    <List label={label} className={clsx(className)} testId="account-list">
      {accounts.map(({ id, balance, name, type, currentDateBalance }) => {
        const Icon = ACCOUNT_TYPE_MAPPING[type].Icon;

        return (
          <Link
            href={`/accounts/${id}`}
            testId="account-row"
            key={id}
            className={clsx(
              'bg-layer hover:bg-accent',
              'p-4',
              'flex items-center gap-4',
            )}
            transition="slideInFromRight"
            hasHoverEffect={false}
          >
            <div
              className={clsx(
                'bg-accent rounded-xl h-11 w-11',
                'inline-flex items-center justify-center shrink-0',
              )}
            >
              <Icon />
            </div>
            <div
              className={clsx(
                'grid grid-cols-[auto,1fr] items-center gap-2 grow',
              )}
            >
              <span className="truncate" data-testid="account-name">
                {name}
              </span>
              <span
                className="text-lg font-medium text-right whitespace-nowrap"
                data-testid="account-balance"
              >
                {formatCurrency(currentDateBalance ?? balance)}
              </span>
            </div>
          </Link>
        );
      })}
    </List>
  );
};
