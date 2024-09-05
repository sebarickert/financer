import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Layout } from '$layouts/layout/layout';
import { Dashboard } from '$views/dashboard/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const HomePage = () => {
  // Let next.js we use dynamic methods here so it must use dynamic SSR
  // In the data fetching we use cookies with dynamic import so it maybe cannot detect it
  cookies();
  return (
    <Layout title="Dashboard">
      <Dashboard />
    </Layout>
  );
};

export default HomePage;
