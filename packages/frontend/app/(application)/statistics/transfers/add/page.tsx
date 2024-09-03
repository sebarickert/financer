import { Metadata } from 'next';

import { TransferAddContainer } from '$container/transfers/transfer.add.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Add Transfer',
};

const AddTransferPage = () => {
  return (
    <Layout title="Add Transfer">
      <TransferAddContainer />
    </Layout>
  );
};

export default AddTransferPage;
