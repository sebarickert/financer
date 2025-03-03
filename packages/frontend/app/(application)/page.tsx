import { Metadata } from 'next';

import { DashboardContainer } from '@/container/DashboardContainer';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const HomePage = () => {
  return <DashboardContainer />;
};

export default HomePage;
