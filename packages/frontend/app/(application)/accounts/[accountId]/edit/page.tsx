import { Metadata } from 'next';
import { FC } from 'react';

import { AccountEditContainer } from '$container/accounts/account.edit.container';
import { Layout } from '$layouts/Layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Account',
};

type AccountEditPageProps = {
  params: {
    accountId: string;
  };
};

const AccountEditPage: FC<AccountEditPageProps> = ({
  params: { accountId },
}) => {
  return (
    <Layout title="Edit Account">
      <AccountEditContainer id={accountId} />
    </Layout>
  );
};

export default AccountEditPage;
