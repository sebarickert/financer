import { Metadata } from 'next';

import { DashboardSettingsContainer } from '$container/user-preferences/dashboard-settings.container';
import { Layout } from '$layouts/Layout';

export const metadata: Metadata = {
  title: 'Dashboard Settings',
};

const DashboardSettingsUserPreferencePage = () => {
  return (
    <Layout title="Dashboard Settings">
      <DashboardSettingsContainer />
    </Layout>
  );
};

export default DashboardSettingsUserPreferencePage;
