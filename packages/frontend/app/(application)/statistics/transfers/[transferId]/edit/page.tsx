import { Metadata } from 'next';
import { FC } from 'react';

import { TransferEditContainer } from '$container/transfers/TransferEditContainer';

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
  return <TransferEditContainer id={transferId} />;
};

export default EditTransferPage;
