import { FC } from 'react';

import { TransferListingContainer } from '$container/transfers/transfer.listing.container';

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
    <TransferListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default TransfersPage;
