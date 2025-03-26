import { Plus } from 'lucide-react';
import { Metadata } from 'next';

import { AccountType } from '@/api/ssr-financer-api';
import { getAllAccounts } from '@/api-service';
import { RequireAccounts } from '@/components/RequireAccounts';
import { Button } from '@/elements/Button/Button';
import { AccountList } from '@/features/account/AccountList';
import { AccountTypeBalanceChart } from '@/features/account/AccountTypeBalanceChart';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Accounts',
};

const accountCategories = {
  savings: 'savings',
  investments: 'investments',
  loans: 'loans',
} as const;

export default async function AccountsPage() {
  const accounts = await getAllAccounts();

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
      <ContentHeader
        title="Accounts"
        action={
          <Button
            href="/accounts/add"
            accentColor="primary"
            size="small"
            testId="add-account"
            isPill
          >
            <Plus />
            <span className="sr-only">Add</span>
            Account
          </Button>
        }
      />
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
