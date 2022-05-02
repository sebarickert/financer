import { AccountType } from '@local/types';

import { IconName } from '../icon/icon';
import { LinkList } from '../link-list/link-list';
import { LinkListLink } from '../link-list/link-list.link';

import { AccountsListRowProps } from './accounts-list.row';

interface IAccountsListProps {
  label?: string;
  rows: AccountsListRowProps[];
  className?: string;
}

export const AccountsList = ({
  label,
  rows,
  className,
}: IAccountsListProps): JSX.Element => {
  return (
    <LinkList label={label} className={`${className}`}>
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
              <span className="truncate">{rowLabel}</span>
              <span className="text-sm font-normal text-gray-600 truncate">
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
