import { AccountEditContainer } from '$container/accounts/account.edit.container';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

const AccountEditPage = () => {
  const {
    query: { accountId },
  } = useViewTransitionRouter();

  return <AccountEditContainer id={accountId as string} />;
};

export default AccountEditPage;
