import { Metadata } from 'next';
import { FC } from 'react';

import { AccountListingContainer } from '$container/accounts/AccountListingContainer';

export const metadata: Metadata = {
  title: 'Accounts',
};

const AccountPage: FC = () => {
  return <AccountListingContainer />;
};

export default AccountPage;
