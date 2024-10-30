import { FC } from 'react';

import { Layout } from '$layouts/Layout';
import { Dashboard } from '$views/Dashboard';

export const DashboardContainer: FC = () => {
  return (
    <Layout title="Dashboard">
      <Dashboard />
    </Layout>
  );
};
