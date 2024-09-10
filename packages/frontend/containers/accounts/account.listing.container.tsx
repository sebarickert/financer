import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import {
  AccountListing,
  AccountListingItem,
} from '$blocks/account-listing/accounts-listing';
import { ButtonInternal } from '$elements/button/button.internal';
import { Icon, IconName } from '$elements/icon/icon';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { AccountService } from '$ssr/api/account.service';
import { formatCurrency } from '$utils/formatCurrency';

const accountCategories = {
  savings: 'savings',
  investments: 'investments',
  loans: 'loans',
} as const;

export const AccountListingContainer: FC = async () => {
  const { data } = await AccountService.getAll();

  const formattedAccounts: AccountListingItem[] = data.map(
    ({ id, balance, name, type }) => ({
      label: name,
      link: `/accounts/${id}`,
      balanceAmount: formatCurrency(balance),
      accountType: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      id,
    }),
  );

  // typescript does not support Object.groupBy but browser and nodejs runtime does
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedAccounts = (Object as any).groupBy(
    formattedAccounts,
    ({ type }: AccountListingItem) => {
      if (type === AccountType.Loan || type === AccountType.Credit) {
        return accountCategories.loans;
      }

      if (type === AccountType.Investment) {
        return accountCategories.investments;
      }

      return accountCategories.savings;
    },
  ) as Record<
    (typeof accountCategories)[keyof typeof accountCategories],
    AccountListingItem[]
  >;

  return (
    <>
      <UpdatePageInfo
        headerAction={
          <ButtonInternal
            link="/accounts/add"
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="add-account"
          >
            <span className="sr-only">Add account</span>
            <Icon type={IconName.viewGridAdd} />
          </ButtonInternal>
        }
      />
      <section className="grid gap-8">
        <AccountListing label="Savings" items={groupedAccounts.savings} />
        <AccountListing
          label="Investments"
          items={groupedAccounts.investments}
        />
        <AccountListing
          label="Credits and Loans"
          items={groupedAccounts.loans}
        />
      </section>
    </>
  );
};
