import { useState, useEffect } from 'react';

import { AccountsList } from '../../components/accounts-list/accounts-list';
import { IAccountsListRowProps } from '../../components/accounts-list/accounts-list.row';
import { Heading } from '../../components/heading/heading';
import { Loader } from '../../components/loader/loader';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAllAccounts } from '../../hooks/account/useAllAccounts';
import { formatCurrency } from '../../utils/formatCurrency';

export const Accounts = (): JSX.Element => {
  const accountsRaw = useAllAccounts();
  const [accounts, setAccounts] = useState<IAccountsListRowProps[]>([]);

  useEffect(() => {
    if (accountsRaw === null) return;
    setAccounts(
      accountsRaw.map(({ _id, balance, name, type }) => ({
        label: name,
        link: `/accounts/${_id}`,
        balanceAmount: formatCurrency(balance),
        accountType: type.charAt(0).toUpperCase() + type.slice(1),
        id: _id,
      }))
    );
  }, [accountsRaw]);

  return accountsRaw === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <UpdatePageInfo title="Accounts" />
      <section className="grid gap-8">
        <section>
          <Heading variant="h1" className="mb-4 lg:mb-6">
            Accounts
          </Heading>
          <QuickLinksItem
            title="Add account"
            link="/accounts/add"
            iconName="view-grid-add"
            iconBackgroundColor="blue"
            testId="add-account"
          />
        </section>
        <AccountsList
          label="Savings"
          rows={accounts.filter(
            ({ accountType }) =>
              accountType.toLowerCase() !== 'loan' &&
              accountType.toLowerCase() !== 'investment'
          )}
        />
        <AccountsList
          label="Investments"
          rows={accounts.filter(
            ({ accountType }) => accountType.toLowerCase() === 'investment'
          )}
        />
        <AccountsList
          label="Loans"
          rows={accounts.filter(
            ({ accountType }) => accountType.toLowerCase() === 'loan'
          )}
        />
      </section>
    </>
  );
};
