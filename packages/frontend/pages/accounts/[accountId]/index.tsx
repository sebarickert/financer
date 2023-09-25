import { AccountContainer } from '$container/accounts/account.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const AccountPage = () => {
  const {
    query: { accountId },
  } = useViewTransitionRouter();

  return <AccountContainer id={accountId as string} />;
};

export default AccountPage;
