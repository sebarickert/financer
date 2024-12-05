import clsx from 'clsx';
import { FC } from 'react';

import { AccountDto } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { List } from '$blocks/List';
import { ACCOUNT_TYPE_MAPPING } from '$constants/account/ACCOUNT_TYPE_MAPPING';
import { Heading } from '$elements/Heading';
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
    <List
      label={label}
      className={clsx(
        className,
        '[&>[data-slot="list"]]:divide-none [&>[data-slot="list"]]:gap-2',
        '[&>[data-slot="list"]]:lg:grid-cols-2',
      )}
      testId="account-list"
      itemRoundness={false}
    >
      {accounts.map(({ id, balance, name, type, currentDateBalance }) => {
        const Icon = ACCOUNT_TYPE_MAPPING[type].Icon;

        return (
          <Link
            href={`/accounts/${id}`}
            testId="account-row"
            key={id}
            className={clsx(
              'bg-layer hover:bg-accent',
              'p-4 rounded-md',
              'grid gap-4',
            )}
            transition="slideInFromRight"
            hasHoverEffect={false}
          >
            <div className="grid grid-cols-[auto,1fr,auto] gap-4 items-center">
              <Icon />
              <Heading
                noMargin
                disableResponsiveSizing
                className="truncate"
                testId="account-name"
              >
                {name}
              </Heading>
              <span className="inline-block px-3 py-1 text-sm rounded-md bg-green/20 shrink-0">
                {ACCOUNT_TYPE_MAPPING[type].label}
              </span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <BalanceDisplay
                className="[&_[data-slot='label']]:sr-only [&_[data-slot='balance']]:text-xl flex-shrink-0"
                label="Account Balance"
                amount={currentDateBalance ?? balance}
              />
              {!!currentDateBalance && currentDateBalance !== balance && (
                <p className="mt-0.5 text-sm text-muted-foreground truncate">
                  <span>Upcoming Balance: </span>
                  <span>{formatCurrency(balance)}</span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </List>
  );
};
