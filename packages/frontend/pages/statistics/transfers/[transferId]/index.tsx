import { useRouter } from 'next/router';

import { TransferContainer } from '$container/transfers/transfer.container';

const TransferPage = () => {
  const {
    query: { transferId },
  } = useRouter();

  return <TransferContainer id={transferId as string} />;
};

export default TransferPage;
