import { EditTransferContainer } from '$container/transfers/transfer.edit.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditTransferPage = () => {
  const {
    query: { transferId },
  } = useViewTransitionRouter();

  return <EditTransferContainer id={transferId as string} />;
};

export default EditTransferPage;
