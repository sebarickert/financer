import { FC } from 'react';

import { UserService } from '$ssr/api/user.service';
import { Statistics } from '$views/statistics/statistics';

export const StatisticsContainer: FC = async () => {
    const theme = await UserService.getOwnUserTheme();
;

  return <Statistics userTheme={theme} />;
};
