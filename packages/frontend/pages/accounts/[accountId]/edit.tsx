import { useRouter } from 'next/router';

import { EditAccountContainer } from '$container/accounts/edit-account.container';

const EditAccountPage = () => {
  const {
    query: { accountId },
  } = useRouter();

  return <EditAccountContainer id={accountId as string} />;
};

export default EditAccountPage;
