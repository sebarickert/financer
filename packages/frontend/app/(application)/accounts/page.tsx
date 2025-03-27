import { Metadata } from 'next';

import { AccountType } from '@/api/ssr-financer-api';
import { Hero } from '@/components/Hero';
import { RequireAccounts } from '@/components/RequireAccounts';
import { AccountList } from '@/features/account/AccountList';
import { AccountTypeBalanceChart } from '@/features/account/AccountTypeBalanceChart';
import { AccountService } from '@/ssr/api/AccountService';

export const metadata: Metadata = {
  title: 'Accounts',
};

const accountCategories = {
  savings: 'savings',
  investments: 'investments',
  loans: 'loans',
} as const;

export default async function AccountsPage() {
  const accounts = await AccountService.getAll();

  const groupedAccounts = Object.groupBy(accounts, ({ type }) => {
    if (type === AccountType.LOAN || type === AccountType.CREDIT) {
      return accountCategories.loans;
    }

    if (type === AccountType.INVESTMENT) {
      return accountCategories.investments;
    }

    return accountCategories.savings;
  });

  return (
    <>
      <Hero title="Accounts" />
      {/* <ContentHeader
        title={'Accounts'}
        headerAction={
          <Button
            href="/accounts/add"
            accentColor="secondary"
            size="icon"
            testId="add-account"
            transition="slideInFromRight"
            className="max-lg:button-ghost"
          >
            <span className="sr-only">Add account</span>
            <Plus />
          </Button>
        }
      /> */}
      <RequireAccounts>
        <div className="grid gap-6">
          <AccountTypeBalanceChart data={accounts} className="self-baseline" />
          <div className="grid gap-6">
            <AccountList label="Savings" accounts={groupedAccounts.savings} />
            <AccountList
              label="Investments"
              accounts={groupedAccounts.investments}
            />
            <AccountList
              label="Credits and Loans"
              accounts={groupedAccounts.loans}
            />
          </div>
        </div>
      </RequireAccounts>
    </>
  );
}
