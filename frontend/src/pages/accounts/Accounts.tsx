import React, { useState, useEffect } from 'react';

import { AccountsList } from '../../components/accounts-list/accounts-list';
import { IAccountsListRowProps } from '../../components/accounts-list/accounts-list.row';
import { Heading } from '../../components/heading/heading';
import { Loader } from '../../components/loader/loader';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { SEO } from '../../components/seo/seo';
import { useAllAccounts } from '../../hooks/useAllAccounts';
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
      <SEO title="Accounts" />
      <section className="grid gap-8">
        <section>
          <Heading variant="h1" className="mb-6">
            Accounts
          </Heading>
          <QuickLinks>
            <QuickLinksItem
              title="Add account"
              link="/accounts/add"
              iconName="view-grid-add"
              iconBackgroundColor="blue"
            />
            <QuickLinksItem
              title="Transfer"
              link="/statistics/transfers/add"
              iconName="switch-horizontal"
              iconBackgroundColor="blue"
            />
          </QuickLinks>
        </section>
        <AccountsList
          label="Savings accounts"
          rows={accounts.filter(
            ({ accountType }) => accountType.toLowerCase() !== 'loan'
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
