import { Metadata } from 'next';
import { FC } from 'react';

import { TransferEditContainer } from '$container/transfers/transfer.edit.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Transfer',
};

type EditTransferPageProps = {
  params: {
    transferId: string;
  };
};

const EditTransferPage: FC<EditTransferPageProps> = ({
  params: { transferId },
}) => {
  return (
    <Layout title="Edit Transfer">
      <TransferEditContainer id={transferId} />
    </Layout>
  );
};

export default EditTransferPage;
