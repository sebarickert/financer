import { Metadata } from 'next';
import { FC } from 'react';

import { AccountAddContainer } from '$container/accounts/account.add.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Add Account',
};

const AddAccountPage: FC = () => {
  return (
    <Layout title="Add Account">
      <AccountAddContainer />
    </Layout>
  );
};

export default AddAccountPage;
