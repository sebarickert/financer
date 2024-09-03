import { Metadata } from 'next';
import { FC } from 'react';

import { TransferListingContainer } from '$container/transfers/transfer.listing.container';
import { Layout } from '$layouts/layout/layout';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Transfers',
};

type TransfersPageProps = {
  searchParams: {
    date?: string;
    page?: string;
  };
};

const TransfersPage: FC<TransfersPageProps> = ({
  searchParams: { date, page },
}) => {
  return (
    <Layout title="Transfers">
      <TransferListingContainer
        date={date as string}
        page={parseInt(page as string)}
      />
    </Layout>
  );
};

export default TransfersPage;
