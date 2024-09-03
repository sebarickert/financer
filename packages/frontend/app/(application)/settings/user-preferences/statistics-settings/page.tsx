import { Metadata } from 'next';

import { StatisticsSettingsContainer } from '$container/user-preferences/statistics-settings.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Statistics Settings',
};

const StatisticsSettingsUserPreferencePage = () => {
  return (
    <Layout title="Statistics Settings">
      <StatisticsSettingsContainer />
    </Layout>
  );
};

export default StatisticsSettingsUserPreferencePage;
