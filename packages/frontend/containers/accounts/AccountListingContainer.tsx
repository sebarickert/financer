import { FC } from 'react';

import { AccountType } from '$api/generated/financerApi';
import { EmptyContentBlock } from '$blocks/EmptyContentBlock';
import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { AccountList } from '$features/account/AccountList';
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
        <Button
          href="/accounts/add"
          accentColor="secondary"
          size="icon"
          testId="add-account"
          transition="slideInFromRight"
        >
          <span className="sr-only">Add account</span>
          <Icon name="PlusIcon" />
        </Button>
      }
    >
      {!accounts.length && (
        <EmptyContentBlock
          title="No Accounts Added"
          icon="Squares2X2Icon"
          action={<Button href="/accounts/add">Add Account</Button>}
        >
          It seems you haven&apos;t added any accounts yet. Get started by
          adding your first account to begin organizing and tracking your
          finances.
        </EmptyContentBlock>
      )}
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
