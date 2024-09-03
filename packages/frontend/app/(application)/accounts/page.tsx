import { Metadata } from 'next';

import { AccountListingContainer } from '$container/accounts/account.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Accounts',
};

const AccountPage = () => {
  return (
    <Layout title="Accounts">
      <AccountListingContainer />
    </Layout>
  );
};

export default AccountPage;
