import { AccountType } from '@local/types';

import { AccountsListRowProps } from './accounts-list.row';

import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';

interface AccountsListProps {
  label?: string;
  rows: AccountsListRowProps[];
  className?: string;
}

export const AccountsList = ({
  label,
  rows,
  className,
}: AccountsListProps): JSX.Element | null => {
  if (!rows?.length) return null;

  return (
    <LinkList label={label} className={`${className}`} testId="account-list">
      {rows.map(({ id, balanceAmount, label: rowLabel, link, type }) => {
        const accountTypeIconMapping: { [key in AccountType]: IconName } = {
          cash: IconName.cash,
          savings: IconName.star,
          investment: IconName.trendingUp,
          credit: IconName.creditCard,
          loan: IconName.library,
          'long-term savings': IconName.star,
          'pre-assigned cash': IconName.paperAirplane,
        };

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
