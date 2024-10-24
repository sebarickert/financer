import { Metadata } from 'next';
import { FC } from 'react';

import { AccountContainer } from '$container/accounts/account.container';
import { Layout } from '$layouts/Layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Account Details',
};

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

const AccountPage: FC<AccountPageProps> = ({ params: { accountId } }) => {
  return (
    <Layout title="Account Details">
      <AccountContainer id={accountId} />
    </Layout>
  );
};

export default AccountPage;
