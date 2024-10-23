import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { accountTypeIconMapping } from '$constants/account/accountTypeMapping';

export interface AccountListingItem {
  accountType: string;
  type: AccountType;
  balanceAmount: string;
  label: string;
  link?: string;
  id: string;
}

interface AccountListProps {
  label?: string;
  items: AccountListingItem[];
  className?: string;
}

export const AccountList: FC<AccountListProps> = ({
  label,
  items,
  className,
}) => {
  if (items.length === 0) return null;

  return (
    <List label={label} className={`${className}`} testId="account-list">
      {items.map(({ id, balanceAmount, label: rowLabel, link, type }) => {
        return (
          <ProminentLink
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
          </ProminentLink>
        );
      })}
    </List>
  );
};
