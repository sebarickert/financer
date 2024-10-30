import clsx from 'clsx';
import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { AccountList } from '$blocks/AccountList';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/Link';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/account.service';

const accountCategories = {
  savings: 'savings',
  investments: 'investments',
  loans: 'loans',
} as const;

export const AccountListingContainer: FC = async () => {
  const { data: accounts } = await AccountService.getAll();

  const groupedAccounts = Object.groupBy(accounts, ({ type }) => {
    if (type === AccountType.Loan || type === AccountType.Credit) {
      return accountCategories.loans;
    }

    if (type === AccountType.Investment) {
      return accountCategories.investments;
    }

    return accountCategories.savings;
  });

  return (
    <Layout
      title="Accounts"
      headerAction={
        <Link
          href="/accounts/add"
          className={clsx(
            'theme-layer-color-with-hover theme-focus rounded-md',
            'inline-flex items-center justify-center h-11 w-11',
          )}
          testId="add-account"
          transition="slideInFromRight"
        >
          <span className="sr-only">Add account</span>
          <Icon name="PlusIcon" />
        </Link>
      }
    >
      <section className="grid gap-8">
        <AccountList label="Savings" accounts={groupedAccounts.savings} />
        <AccountList
          label="Investments"
          accounts={groupedAccounts.investments}
        />
        <AccountList
          label="Credits and Loans"
          accounts={groupedAccounts.loans}
        />
      </section>
    </Layout>
  );
};
