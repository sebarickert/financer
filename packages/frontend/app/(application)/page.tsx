import { Metadata } from 'next';

import { Layout } from '$layouts/Layout';
import { Dashboard } from '$views/dashboard/Dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const HomePage = () => {
  return (
    <Layout title="Dashboard">
      <Dashboard />
    </Layout>
  );
};

export default HomePage;
