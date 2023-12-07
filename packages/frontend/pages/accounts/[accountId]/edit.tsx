import { EditAccountContainer } from '$container/accounts/account.edit.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditAccountPage = () => {
  const {
    query: { accountId },
  } = useViewTransitionRouter();

  return <EditAccountContainer id={accountId as string} />;
};

export default EditAccountPage;
