import { Metadata } from 'next';
import { FC } from 'react';

import { TransferListingContainer } from '$container/transfers/transfer.listing.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Transfers',
};

const TransfersPage: FC = () => {
  return (
    <Layout title="Transfers">
      <TransferListingContainer />
    </Layout>
  );
};

export default TransfersPage;
