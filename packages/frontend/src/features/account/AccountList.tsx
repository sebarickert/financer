import clsx from 'clsx';
import { FC } from 'react';

import { AccountDto, AccountType } from '$api/generated/financerApi';
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
            id={id}
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
              <span
                className={clsx(
                  'inline-flex items-center gap-2 text-sm shrink-0 relative text-muted-foreground',
                  'after:w-3 after:h-3 after:rounded-full after:block',
                  type === AccountType.Savings &&
                    'after:bg-[hsl(var(--account-SAVINGS))]',
                  type === AccountType.Cash &&
                    'after:bg-[hsl(var(--account-CASH))]',
                  type === AccountType.LongTermSavings &&
                    'after:bg-[hsl(var(--account-LONG-TERM-SAVINGS))]',
                  type === AccountType.PreAssignedCash &&
                    'after:bg-[hsl(var(--account-PRE-ASSIGNED-CASH))]',
                  type === AccountType.Investment &&
                    'after:bg-[hsl(var(--account-INVESTMENT))]',
                  type === AccountType.Credit &&
                    'after:bg-[hsl(var(--account-CREDIT))]',
                  type === AccountType.Loan &&
                    'after:bg-[hsl(var(--account-LOAN))]',
                )}
              >
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
                  <span className="sr-only">Upcoming Balance: </span>
                  <span data-testid="upcoming-balance">
                    {formatCurrency(balance)}
                  </span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </List>
  );
};
