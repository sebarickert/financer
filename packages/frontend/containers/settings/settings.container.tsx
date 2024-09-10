import { FC } from 'react';

import { UserService } from '$ssr/api/user.service';
import { Settings } from '$views/settings/settings';

export const SettingsContainer: FC = async () => {
  const userInfo = await UserService.getOwnUser();

  return <Settings roles={userInfo.roles} />;
};
