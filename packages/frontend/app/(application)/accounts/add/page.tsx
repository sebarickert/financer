import { Metadata } from 'next';

import { handleAccountAdd } from '@/actions/account/handleAccountAdd';
import { AccountForm } from '@/features/account/AccountForm';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Add Account',
};

export default function AccountAddPage() {
  return (
    <>
      <ContentHeader title="Add Account" backLink="/accounts" />
      <AccountForm onSubmit={handleAccountAdd} submitLabel="Save Account" />
    </>
  );
}
