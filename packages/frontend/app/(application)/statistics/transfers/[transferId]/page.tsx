import { FC } from 'react';

import { TransferContainer } from '$container/transfers/transfer.container';

type TransferPageProps = {
  params: {
    transferId: string;
  };
};

const TransferPage: FC<TransferPageProps> = ({ params: { transferId } }) => {
  return <TransferContainer id={transferId} />;
};

export default TransferPage;
