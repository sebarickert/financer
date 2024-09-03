import { Metadata } from 'next';

import { DefaultAccountSettingsContainer } from '$container/user-preferences/default-account-settings.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Default Account Settings',
};

const DefaultAccountSettingsUserPreferencePage = () => {
  return (
    <Layout title="Default Account Settings">
      <DefaultAccountSettingsContainer />
    </Layout>
  );
};

export default DefaultAccountSettingsUserPreferencePage;
