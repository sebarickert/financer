import { AccountType } from '@local/types';
import { useState, useEffect } from 'react';

import { AccountsList } from '../../components/blocks/accounts-list/accounts-list';
import { AccountsListRowProps } from '../../components/blocks/accounts-list/accounts-list.row';
import { IconName } from '../../components/elements/icon/icon';
import { LinkList } from '../../components/elements/link-list/link-list';
import { LinkListLink } from '../../components/elements/link-list/link-list.link';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';
import { useAllAccounts } from '../../hooks/account/useAllAccounts';
import { formatCurrency } from '../../utils/formatCurrency';

export const Accounts = (): JSX.Element => {
  const { data: accountsRaw } = useAllAccounts();
  const [accounts, setAccounts] = useState<AccountsListRowProps[]>([]);

  useEffect(() => {
    setAccounts(
      accountsRaw.map(({ _id, balance, name, type }) => ({
        label: name,
        link: `/accounts/${_id}`,
        balanceAmount: formatCurrency(balance),
        type,
        accountType: type.charAt(0).toUpperCase() + type.slice(1),
        id: _id,
      }))
    );
  }, [accountsRaw]);

  const savingsAccounts = accounts.filter(
    ({ type }) =>
      type !== AccountType.LOAN &&
      type !== AccountType.INVESTMENT &&
      type !== AccountType.CREDIT
  );

  const investmentAccounts = accounts.filter(
    ({ type }) => type === AccountType.INVESTMENT
  );

  const creditAndLoanAccounts = accounts.filter(
    ({ type }) => type === AccountType.LOAN || type === AccountType.CREDIT
  );

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
        {savingsAccounts?.length > 0 && (
          <AccountsList label="Savings" rows={savingsAccounts} />
        )}
        {investmentAccounts?.length > 0 && (
          <AccountsList label="Investments" rows={investmentAccounts} />
        )}
        {creditAndLoanAccounts?.length > 0 && (
          <AccountsList
            label="Credits and Loans"
            rows={creditAndLoanAccounts}
          />
        )}
      </section>
    </>
  );
};
