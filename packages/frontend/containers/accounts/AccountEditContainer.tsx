import { notFound } from 'next/navigation';
import { FC } from 'react';

import { AccountForm } from '$blocks/AccountForm';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/account.service';
import { handleAccountEdit } from 'src/actions/account/handleAccountEdit';

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
        submitLabel="Update"
        initialValues={account}
      />
    </Layout>
  );
};
