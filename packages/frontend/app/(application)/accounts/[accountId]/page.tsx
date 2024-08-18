import { FC } from 'react';

import { AccountContainer } from '$container/accounts/account.container';

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

const AccountPage: FC<AccountPageProps> = ({ params: { accountId } }) => {
  return <AccountContainer id={accountId} />;
};

export default AccountPage;
