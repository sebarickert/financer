import { Grid2x2, Plus } from 'lucide-react';
import { Metadata } from 'next';

import { AccountType } from '@/api/ssr-financer-api';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { Button } from '@/elements/Button/Button';
import { AccountList } from '@/features/account/AccountList';
import { AccountTypeBalanceChart } from '@/features/account/AccountTypeBalanceChart';
import { ContentHeader } from '@/layouts/ContentHeader';
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
      <ContentHeader
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
      />
      {!accounts.length && (
        <InfoMessageBlock
          title="No Accounts Added"
          Icon={Grid2x2}
          action={<Button href="/accounts/add">Add Account</Button>}
        >
          It seems you haven&apos;t added any accounts yet. Get started by
          adding your first account to begin organizing and tracking your
          finances.
        </InfoMessageBlock>
      )}
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
    </>
  );
}
