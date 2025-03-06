import { Metadata } from 'next';
import { FC } from 'react';

import { StatisticsOverviewContainer } from '@/container/statistics/StatisticsOverviewContainer';

export const metadata: Metadata = {
  title: 'Statistics',
};

const StatisticsOverviewPage: FC = () => {
  return <StatisticsOverviewContainer />;
};

export default StatisticsOverviewPage;
