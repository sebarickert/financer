import { useRouter } from 'next/router';

import { TransferListingContainer } from '$container/transfers/transfer-listing.container';

const TransfersPage = () => {
  const {
    query: { date, page },
  } = useRouter();

  return (
    <TransferListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default TransfersPage;
