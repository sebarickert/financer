import React, { useState, useEffect } from 'react';

import { AccountsList } from '../../components/accounts-list/accounts-list';
import { IAccountsListRowProps } from '../../components/accounts-list/accounts-list.row';
import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { StatsItem } from '../../components/stats/stats.item';
import { formatCurrency } from '../../utils/formatCurrency';

import { getAllAccounts } from './AccountService';

export const Accounts = (): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IAccountsListRowProps[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(NaN);

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsRaw(await getAllAccounts());
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accountsRaw === null) return;

    const total = accountsRaw.reduce(
      (currentTotal, { balance, type }) =>
        currentTotal + (type !== 'loan' ? balance : 0),
      0
    );
    setTotalBalance(total);
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
      <Banner title="Accounts" headindType="h1" className="mb-8">
        <BannerText>Overview page for your accounts and loans.</BannerText>
        <ButtonGroup className="mt-6">
          <Button link="/accounts/add" accentColor="blue" testId="add-account">
            Add account
          </Button>
          <Button link="/statistics/transfers/add" accentColor="blue">
            Transfer
          </Button>
        </ButtonGroup>
      </Banner>
      <StatsItem statLabel="Total Balance">
        {`${formatCurrency(totalBalance)}`}
      </StatsItem>
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
        className="mt-12"
      />
    </>
  );
};
