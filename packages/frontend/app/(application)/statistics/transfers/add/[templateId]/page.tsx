import { FC } from 'react';

import { TransferAddContainer } from '$container/transfers/transfer.add.container';

type AddTransferWithTemplateIdPageProps = {
  params: {
    templateId: string;
  };
};

const AddTransferWithTemplateIdPage: FC<AddTransferWithTemplateIdPageProps> = ({
  params: { templateId },
}) => {
  return <TransferAddContainer templateId={templateId} />;
};

export default AddTransferWithTemplateIdPage;
