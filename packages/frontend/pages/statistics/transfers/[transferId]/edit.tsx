import { useRouter } from 'next/router';

import { EditTransferContainer } from '$container/transfers/edit-transfer.container';

const EditTransferPage = () => {
  const {
    query: { transferId },
  } = useRouter();

  return <EditTransferContainer id={transferId as string} />;
};

export default EditTransferPage;
