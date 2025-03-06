import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleAccountEdit } from '@/actions/account/handleAccountEdit';
import { AccountForm } from '@/features/account/AccountForm';
import { Layout } from '@/layouts/Layout';
import { AccountService } from '@/ssr/api/AccountService';

type AccountEditContainerProps = {
  id: string;
};

export const AccountEditContainer: FC<AccountEditContainerProps> = async ({
  id,
}) => {
  const account = await AccountService.getById(id);

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
