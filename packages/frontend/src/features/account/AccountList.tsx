import clsx from 'clsx';
import { FC, Fragment } from 'react';

import { SchemaAccountDto } from '@/api/ssr-financer-api';
import { BalanceDisplay } from '@/blocks/BalanceDisplay';
import { List } from '@/blocks/List';
import { ACCOUNT_TYPE_MAPPING } from '@/constants/account/ACCOUNT_TYPE_MAPPING';
import { Heading } from '@/elements/Heading';
import { Link } from '@/elements/Link';
import { formatCurrency } from '@/utils/formatCurrency';

export interface AccountListingItem {
  balanceAmount: string;
  accountName: string;
  url: string;
  id: string;
}

interface AccountListProps {
  label?: string;
  accounts: SchemaAccountDto[] | undefined;
  className?: string;
}

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
        return (
          <Fragment key={id}>
            <style>{`
              [data-account-item='${id}'] {
                --color-account: ${ACCOUNT_TYPE_MAPPING[type].color};
              }
            `}</style>
            <Link
              id={id}
              href={`/accounts/${id}`}
              testId="account-row"
              className={clsx(
                'bg-layer hover:bg-accent active:bg-accent',
                'py-4 px-6 rounded-md',
                'grid',
              )}
              hasHoverEffect={false}
              data-account-item={id}
            >
              <div className="flex items-center gap-6 justify-between overflow-hidden">
                <Heading noMargin testId="account-name" className="truncate">
                  {name}
                </Heading>
                <BalanceDisplay
                  className="[&_[data-slot='label']]:sr-only [&_[data-slot='balance']]:text-xl text-right whitespace-nowrap"
                  label="Account Balance"
                  amount={currentDateBalance ?? balance}
                />
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-6 justify-between overflow-hidden">
                <span
                  className={clsx(
                    'inline-flex items-center gap-2 relative truncate',
                    'before:w-3 before:h-3 before:rounded-full before:block before:bg-(--color-account) before:shrink-0',
                  )}
                >
                  <span className="truncate">
                    {ACCOUNT_TYPE_MAPPING[type].label}
                  </span>
                </span>
                {Boolean(currentDateBalance) &&
                  currentDateBalance !== balance && (
                    <p className="">
                      <span className="sr-only">Upcoming Balance: </span>
                      <span data-testid="upcoming-balance">
                        {formatCurrency(balance)}
                      </span>
                    </p>
                  )}
              </div>
            </Link>
          </Fragment>
        );
      })}
    </List>
  );
};
