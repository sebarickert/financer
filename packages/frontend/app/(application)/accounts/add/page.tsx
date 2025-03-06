import { Metadata } from 'next';
import { FC } from 'react';

import { AccountAddContainer } from '@/container/accounts/AccountAddContainer';

export const metadata: Metadata = {
  title: 'Add Account',
};

const AddAccountPage: FC = () => {
  return <AccountAddContainer />;
};

export default AddAccountPage;
