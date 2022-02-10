import React, { useEffect, useState } from 'react';

import { getAllAccounts } from '../../pages/accounts/AccountService';
import { formatCurrency } from '../../utils/formatCurrency';
import { IAccountsListRowProps } from '../accounts-list/accounts-list.row';
import { Button } from '../button/button';
import { Loader } from '../loader/loader';

import { DashboardAccountsItem } from './dashboard.accounts.item';

interface IDashboardAccountsProps {
  label?: string;
  className?: string;
}

export const DashboardAccounts = ({
  className = '',
}: IDashboardAccountsProps): JSX.Element => {
  const [accountsRaw, setAccountsRaw] = useState<IAccount[] | null>(null);
  const [accounts, setAccounts] = useState<IAccountsListRowProps[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsRaw(await getAllAccounts());
    };
    fetchAccounts();
  }, []);

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

  return (
    <section className={`bg-white border rounded-lg py-1 ${className}`}>
      {accountsRaw === null && <Loader loaderColor="blue" />}
      {accounts.length === 0 && accountsRaw !== null ? (
        <section className="flex flex-col justify-center items-center gap-4 h-full p-6">
          <p className="text-center">You have no accounts.</p>
          <Button link="/accounts/add" accentColor="blue">
            Add account
          </Button>
        </section>
      ) : (
        <ul className="divide-y">
          {accounts
            .filter(({ accountType }) => accountType.toLowerCase() !== 'loan')
            .map((account) => (
              <DashboardAccountsItem {...account} />
            ))}
        </ul>
      )}
    </section>
  );
};
