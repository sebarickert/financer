import { Metadata } from 'next';

import { getTransferById } from '@/api-service';
import { TransferEditContainer } from '@/container/transfers/TransferEditContainer';
type Params = Promise<{
  transferId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { transferId } = await params;
  const transfer = await getTransferById(transferId);

  return {
    title: `Edit ${transfer.description} / Transfers`,
  };
};

const EditTransferPage = async ({ params }: { params: Params }) => {
  const { transferId } = await params;

  return <TransferEditContainer id={transferId} />;
};

export default EditTransferPage;
