import { FC } from 'react';

import { ThemeSwitcherClient } from './ThemeSwitcherClient';

import { UserService } from '@/ssr/api/UserService';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = async ({ className }) => {
  const theme = await UserService.getOwnUserTheme();

  return <ThemeSwitcherClient theme={theme} className={className} />;
};
