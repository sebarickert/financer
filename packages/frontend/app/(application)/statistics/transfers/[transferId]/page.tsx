import { Metadata } from 'next';
import { FC } from 'react';

import { TransferContainer } from '$container/transfers/transfer.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Transfer Details',
};

type TransferPageProps = {
  params: {
    transferId: string;
  };
};

const TransferPage: FC<TransferPageProps> = ({ params: { transferId } }) => {
  return (
    <Layout title="Transfer Details">
      <TransferContainer id={transferId} />
    </Layout>
  );
};

export default TransferPage;
