import { TransferContainer } from '$container/transfers/transfer.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const TransferPage = () => {
  const {
    query: { transferId },
  } = useViewTransitionRouter();

  return <TransferContainer id={transferId as string} />;
};

export default TransferPage;
