import { useMemo } from 'react';

import {
  AccountTypeEnum,
  useAccountsFindAllByUserQuery,
} from '$api/generated/financerApi';
import { AccountsList } from '$blocks/accounts-list/accounts-list';
import { AccountsListRowProps } from '$blocks/accounts-list/accounts-list.row';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { Loader } from '$elements/loader/loader';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { formatCurrency } from '$utils/formatCurrency';

export const Accounts = (): JSX.Element => {
  const { data: accountsRaw, isLoading } = useAccountsFindAllByUserQuery({});

  // const [accounts, setAccounts] = useState<AccountsListRowProps[]>([]);

  const accounts = useMemo(() => {
    if (!accountsRaw) {
      return {
        savings: [],
        investments: [],
        loans: [],
      };
    }

    const formattedAccounts: AccountsListRowProps[] = accountsRaw.data.map(
      ({ _id, balance, name, type }) => ({
        label: name,
        link: `/accounts/${_id}`,
        balanceAmount: formatCurrency(balance),
        type: type as AccountTypeEnum,
        accountType: type.charAt(0).toUpperCase() + type.slice(1),
        id: _id,
      })
    );

    const savings = formattedAccounts.filter(
      ({ type }) =>
        type !== AccountTypeEnum.Loan &&
        type !== AccountTypeEnum.Investment &&
        type !== AccountTypeEnum.Credit
    );

    const investments = formattedAccounts.filter(
      ({ type }) => type === AccountTypeEnum.Investment
    );

    const loans = formattedAccounts.filter(
      ({ type }) =>
        type === AccountTypeEnum.Loan || type === AccountTypeEnum.Credit
    );

    return {
      savings,
      investments,
      loans,
    };
  }, [accountsRaw]);

  return (
    <>
      <UpdatePageInfo title="Accounts" />
      <section className="grid gap-8">
        <section>
          <LinkList>
            <LinkListLink
              testId="add-account"
              link="/accounts/add"
              icon={IconName.viewGridAdd}
            >
              Add account
            </LinkListLink>
          </LinkList>
        </section>
        <Loader isLoading={isLoading}>
          <AccountsList label="Savings" rows={accounts.savings} />
          <AccountsList label="Investments" rows={accounts.investments} />
          <AccountsList label="Credits and Loans" rows={accounts.loans} />
        </Loader>
      </section>
    </>
  );
};
