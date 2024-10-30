import { Metadata } from 'next';
import { FC } from 'react';

import { AccountContainer } from '$container/accounts/AccountContainer';

// TODO change to dynamic title
export const metadata: Metadata = {
  title: 'Account Details',
};

type AccountPageProps = {
  params: {
    accountId: string;
  };
};

const AccountPage: FC<AccountPageProps> = ({ params: { accountId } }) => {
  return <AccountContainer id={accountId} />;
};

export default AccountPage;
