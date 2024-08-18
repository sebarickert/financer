import { FC } from 'react';

import { AccountEditContainer } from '$container/accounts/account.edit.container';

type AccountEditPageProps = {
  params: {
    accountId: string;
  };
};

const AccountEditPage: FC<AccountEditPageProps> = ({
  params: { accountId },
}) => {
  return <AccountEditContainer id={accountId} />;
};

export default AccountEditPage;
