import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { accountTypeIconMapping } from '$constants/account/accountTypeMapping';
import { LinkList } from '$elements/LinkList/LinkList';
import { LinkListLink } from '$elements/LinkList/LinkListLink';

export interface AccountListingItem {
  accountType: string;
  type: AccountType;
  balanceAmount: string;
  label: string;
  link?: string;
  id: string;
}

interface AccountsListProps {
  label?: string;
  items: AccountListingItem[];
  className?: string;
}

export const AccountListing: FC<AccountsListProps> = ({
  label,
  items,
  className,
}) => {
  if (!items?.length) return null;

  return (
    <LinkList label={label} className={`${className}`} testId="account-list">
      {items.map(({ id, balanceAmount, label: rowLabel, link, type }) => {
        return (
          <LinkListLink
            link={link ?? ''}
            icon={accountTypeIconMapping[type]}
            testId="account-row"
            key={id}
          >
            <span className="grid">
              <span className="text-black truncate">{rowLabel}</span>
              <span className="text-sm font-normal tracking-tight truncate text-gray-darkest">
                <span className="sr-only">Balance: </span>
                {balanceAmount}
              </span>
            </span>
          </LinkListLink>
        );
      })}
    </LinkList>
  );
};
