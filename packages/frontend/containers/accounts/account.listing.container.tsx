import { useMemo } from 'react';

import {
  useAccountsFindAllByUserQuery,
  AccountTypeEnum,
} from '$api/generated/financerApi';
import { AccountsListRowProps } from '$blocks/accounts-list/accounts-list.row';
import { AccountListing } from '$pages/accounts/account.listing';
import { formatCurrency } from '$utils/formatCurrency';

export const AccountListingContainer = () => {
  const { data: accountsRaw, isFetching } = useAccountsFindAllByUserQuery({});

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

  return <AccountListing isFetching={isFetching} accounts={accounts} />;
};
