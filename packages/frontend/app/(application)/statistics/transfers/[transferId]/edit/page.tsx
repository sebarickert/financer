import { Metadata } from 'next';
import { FC } from 'react';

import { TransferEditContainer } from '$container/transfers/TransferEditContainer';
import { TransferService } from '$ssr/api/transfer.service';

type EditTransferPageProps = {
  params: {
    transferId: string;
  };
};

export const generateMetadata = async ({
  params: { transferId },
}: EditTransferPageProps): Promise<Metadata> => {
  const transfer = await TransferService.getById(transferId);

  return {
    title: `Edit ${transfer.description} / Transfers`,
  };
};

const EditTransferPage: FC<EditTransferPageProps> = ({
  params: { transferId },
}) => {
  return <TransferEditContainer id={transferId} />;
};

export default EditTransferPage;
