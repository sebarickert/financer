import { Metadata } from 'next';

import { TransferEditContainer } from '$container/transfers/TransferEditContainer';
import { TransferService } from '$ssr/api/transfer.service';

type Params = Promise<{
  transferId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { transferId } = await params;
  const transfer = await TransferService.getById(transferId);

  return {
    title: `Edit ${transfer.description} / Transfers`,
  };
};

const EditTransferPage = async ({ params }: { params: Params }) => {
  const { transferId } = await params;

  return <TransferEditContainer id={transferId} />;
};

export default EditTransferPage;
