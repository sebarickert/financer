import { Metadata } from 'next';

import { AccountAddContainer } from '$container/accounts/account.add.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Add Account',
};

const AddAccountPage = () => {
  return (
    <Layout title="Add Account">
      <AccountAddContainer />
    </Layout>
  );
};

export default AddAccountPage;
