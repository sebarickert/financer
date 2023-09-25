import { AddTransferContainer } from '$container/transfers/add-transfer.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const AddTransferWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useViewTransitionRouter();

  return <AddTransferContainer templateId={templateId as string} />;
};

export default AddTransferWithTemplateIdPage;
