import { Metadata } from 'next';
import { FC } from 'react';

import { TransferListingContainer } from '$container/transfers/TransferListingContainer';

export const metadata: Metadata = {
  title: 'Transfers',
};

const TransfersPage: FC = () => {
  return <TransferListingContainer />;
};

export default TransfersPage;
