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
      {rows.map(({ balanceAmount, label: rowLabel, link, accountType }) => {
        const accountTypeIconMapping: { [key: string]: IconName } = {
          cash: IconName.cash,
          savings: IconName.star,
          investment: IconName.trendingUp,
          credit: IconName.creditCard,
          loan: IconName.library,
        };

        return (
          <LinkListLink
            link={link ?? ''}
            icon={accountTypeIconMapping[accountType.toLowerCase()]}
            testId="account-row"
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
