import { Metadata } from 'next';
import { FC } from 'react';

import { SettingsContainer } from '$container/settings/settings.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Settings',
};

const SettingsPage: FC = () => {
  return (
    <Layout title="Settings">
      <SettingsContainer />
    </Layout>
  );
};

export default SettingsPage;
