import React, { useEffect, useState } from 'react';

import { useAllAccounts } from '../../hooks/account/useAllAccounts';
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
  const { data: accountsRaw, isLoading: isLoadingAccounts } = useAllAccounts();
  const [accounts, setAccounts] = useState<IAccountsListRowProps[]>([]);

  useEffect(() => {
    if (!accountsRaw || isLoadingAccounts) {
      setAccounts([]);
      return;
    }
    setAccounts(
      accountsRaw.map(({ _id, balance, name, type }) => ({
        label: name,
        link: `/accounts/${_id}`,
        balanceAmount: formatCurrency(balance),
        accountType: type.charAt(0).toUpperCase() + type.slice(1),
        id: _id,
      }))
    );
  }, [accountsRaw, isLoadingAccounts]);

  return (
    <section className={`bg-white border rounded-lg py-1 ${className}`}>
      {accountsRaw === null && <Loader loaderColor="blue" />}
      {accounts.length === 0 && accountsRaw !== null ? (
        <section className="flex flex-col items-center justify-center h-full gap-4 p-6">
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
