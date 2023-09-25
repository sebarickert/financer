import { TransferListingContainer } from '$container/transfers/transfer-listing.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const TransfersPage = () => {
  const {
    query: { date, page },
  } = useViewTransitionRouter();

  return (
    <TransferListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default TransfersPage;
