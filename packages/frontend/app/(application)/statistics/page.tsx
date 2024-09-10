import { Metadata } from 'next';
import { FC } from 'react';

import { StatisticsContainer } from '$container/statistics/statistics.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Statistics',
};

const StatisticsPage: FC = () => {
  return (
    <Layout title="Statistics">
      <StatisticsContainer />
    </Layout>
  );
};

export default StatisticsPage;
