import { Metadata } from 'next';
import { FC } from 'react';

import { Layout } from '$layouts/layout/layout';
import { UserPreferences } from '$views/settings/user-preferences/user-preferences';

export const metadata: Metadata = {
  title: 'User Preferences',
};

const UserPreferenceListingPage: FC = () => {
  return (
    <Layout title="User Preferences">
      <UserPreferences />
    </Layout>
  );
};

export default UserPreferenceListingPage;
