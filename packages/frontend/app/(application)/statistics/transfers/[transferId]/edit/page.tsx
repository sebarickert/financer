import { FC } from 'react';

import { TransferEditContainer } from '$container/transfers/transfer.edit.container';

type EditTransferPageProps = {
  params: {
    transferId: string;
  };
};

const EditTransferPage: FC<EditTransferPageProps> = ({
  params: { transferId },
}) => {
  return <TransferEditContainer id={transferId} />;
};

export default EditTransferPage;
