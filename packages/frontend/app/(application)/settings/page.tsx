import { Metadata } from 'next';

import { SettingsContainer } from '$container/settings/settings.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Settings',
};

const SettingsPage = () => {
  return (
    <Layout title="Settings">
      <SettingsContainer />
    </Layout>
  );
};

export default SettingsPage;
