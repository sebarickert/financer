import { Metadata } from 'next';
import { FC } from 'react';

import { StatisticsContainer } from '$container/statistics/StatisticsContainer';

export const metadata: Metadata = {
  title: 'Statistics',
};

const StatisticsPage: FC = () => {
  return <StatisticsContainer />;
};

export default StatisticsPage;
