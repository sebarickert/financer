import { Metadata } from 'next';
import { FC } from 'react';

import { AccountListingContainer } from '$container/accounts/account.listing.container';
import { Layout } from '$layouts/Layout';

export const metadata: Metadata = {
  title: 'Accounts',
};

const AccountPage: FC = () => {
  return (
    <Layout title="Accounts">
      <AccountListingContainer />
    </Layout>
  );
};

export default AccountPage;
