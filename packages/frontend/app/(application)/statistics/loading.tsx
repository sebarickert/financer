import { Loader } from '$elements/Loader';
import { StatisticsLayout } from '$features/statistics/StatisticsLayout';

export default function Loading() {
  return (
    <StatisticsLayout title="Statistics" isLoading>
      <Loader />
    </StatisticsLayout>
  );
}
