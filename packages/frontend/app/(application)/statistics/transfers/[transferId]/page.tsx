import { Metadata } from 'next';

import { TransferContainer } from '$container/transfers/TransferContainer';
import { TransferService } from '$ssr/api/TransferService';

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
    title: `${transfer.description} / Transfers`,
  };
};

const TransferPage = async ({ params }: { params: Params }) => {
  const { transferId } = await params;

  return <TransferContainer id={transferId} />;
};

export default TransferPage;
