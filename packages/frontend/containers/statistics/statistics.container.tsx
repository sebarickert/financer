import { FC } from 'react';

import { UserService } from '$ssr/api/user.service';
import { Statistics } from '$views/statistics/statistics';

export const StatisticsContainer: FC = async () => {
  const { theme } = await UserService.getOwnUser();

  return <Statistics userTheme={theme} />;
};
