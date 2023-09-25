import { EditAccountContainer } from '$container/accounts/edit-account.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const EditAccountPage = () => {
  const {
    query: { accountId },
  } = useViewTransitionRouter();

  return <EditAccountContainer id={accountId as string} />;
};

export default EditAccountPage;
