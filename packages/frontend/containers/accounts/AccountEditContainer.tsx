import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleAccountEdit } from '@/actions/account/handleAccountEdit';
import { getAccountById } from '@/api-service';
import { AccountForm } from '@/features/account/AccountForm';
import { Layout } from '@/layouts/Layout';

interface AccountEditContainerProps {
  id: string;
}

export const AccountEditContainer: FC<AccountEditContainerProps> = async ({
  id,
}) => {
  const account = await getAccountById(id);

  if (!account) {
    notFound();
  }

  const handleSubmit = handleAccountEdit.bind(null, account);

  return (
    <Layout title="Edit Account" backLink={`/accounts/${account.id}`}>
      <AccountForm
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        initialValues={account}
      />
    </Layout>
  );
};
