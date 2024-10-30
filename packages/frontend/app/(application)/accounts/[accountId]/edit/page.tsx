import { Metadata } from 'next';
import { FC } from 'react';

import { AccountEditContainer } from '$container/accounts/AccountEditContainer';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Edit Account',
};

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
