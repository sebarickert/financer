import { Metadata } from 'next';
import { FC } from 'react';

import { TransferContainer } from '$container/transfers/TransferContainer';

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
  return <TransferContainer id={transferId} />;
};

export default TransferPage;
