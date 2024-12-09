import { Metadata } from 'next';
import { FC } from 'react';

import { TransferContainer } from '$container/transfers/TransferContainer';
import { TransferService } from '$ssr/api/TransferService';

type TransferPageProps = {
  params: {
    transferId: string;
  };
};

export const generateMetadata = async ({
  params: { transferId },
}: TransferPageProps): Promise<Metadata> => {
  const transfer = await TransferService.getById(transferId);

  return {
    title: `${transfer.description} / Transfers`,
  };
};

const TransferPage: FC<TransferPageProps> = ({ params: { transferId } }) => {
  return <TransferContainer id={transferId} />;
};

export default TransferPage;
