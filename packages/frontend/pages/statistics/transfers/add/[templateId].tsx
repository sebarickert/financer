import { useRouter } from 'next/router';

import { AddTransferContainer } from '$container/transfers/add-transfer.container';

const AddTransferWithTemplateIdPage = () => {
  const {
    query: { templateId },
  } = useRouter();

  return <AddTransferContainer templateId={templateId as string} />;
};

export default AddTransferWithTemplateIdPage;
