import { TransferAddContainer } from '$container/transfers/transfer.add.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const AddTransferWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <TransferAddContainer templateId={templateId as string} />;
};

export default AddTransferWithTemplateIdPage;
