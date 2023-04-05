import { useRouter } from 'next/router';

import { AccountContainer } from '$container/accounts/account.container';

const AccountPage = () => {
  const {
    query: { accountId },
  } = useRouter();

  return <AccountContainer id={accountId as string} />;
};

export default AccountPage;
