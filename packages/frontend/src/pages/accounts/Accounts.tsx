import { AccountType } from '@local/types';
import { useState, useEffect } from 'react';

import { AccountsList } from '../../components/accounts-list/accounts-list';
import { AccountsListRowProps } from '../../components/accounts-list/accounts-list.row';
import { IconName } from '../../components/icon/icon';
import { Loader, LoaderColor } from '../../components/loader/loader';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAllAccounts } from '../../hooks/account/useAllAccounts';
import { formatCurrency } from '../../utils/formatCurrency';

export const Accounts = (): JSX.Element => {
  const { data: accountsRaw, isLoading } = useAllAccounts();
  const [accounts, setAccounts] = useState<AccountsListRowProps[]>([]);

  useEffect(() => {
    if (!accountsRaw || isLoading) {
      setAccounts([]);
      return;
    }
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
  }, [accountsRaw, isLoading]);

  const savingsAccounts = accounts.filter(
    ({ type }) =>
      type !== AccountType.loan &&
      type !== AccountType.investment &&
      type !== AccountType.credit
  );

  const investmentAccounts = accounts.filter(
    ({ type }) => type === AccountType.investment
  );

  const creditAndLoanAccounts = accounts.filter(
    ({ type }) => type === AccountType.loan || type === AccountType.credit
  );

  return isLoading ? (
    <Loader loaderColor={LoaderColor.blue} />
  ) : (
    <>
      <UpdatePageInfo title="Accounts" />
      <section className="grid gap-8">
        <section>
          <QuickLinksItem
            title="Add account"
            link="/accounts/add"
            iconName={IconName.viewGridAdd}
            iconBackgroundColor="blue"
            testId="add-account"
          />
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
