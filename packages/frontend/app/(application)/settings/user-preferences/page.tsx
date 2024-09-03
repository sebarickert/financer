import { Metadata } from 'next';

import { Layout } from '$layouts/layout/layout';
import { UserPreferences } from '$views/settings/user-preferences/user-preferences';

export const metadata: Metadata = {
  title: 'User Preferences',
};

const UserPreferenceListingPage = () => {
  return (
    <Layout title="User Preferences">
      <UserPreferences />
    </Layout>
  );
};

export default UserPreferenceListingPage;
