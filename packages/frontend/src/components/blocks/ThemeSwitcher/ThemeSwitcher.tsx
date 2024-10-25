import { FC } from 'react';

import { ThemeSwitcherClient } from './ThemeSwitcherClient';

import { UserService } from '$ssr/api/user.service';

export const ThemeSwitcher: FC = async () => {
  const { theme } = await UserService.getOwnUser();

  return <ThemeSwitcherClient theme={theme} />;
};
