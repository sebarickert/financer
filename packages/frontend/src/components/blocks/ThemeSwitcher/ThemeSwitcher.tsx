import { FC } from 'react';

import { ThemeSwitcherClient } from './ThemeSwitcherClient';

import { getOwnUserTheme } from '@/api-service';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = async ({ className }) => {
  const theme = await getOwnUserTheme();

  return <ThemeSwitcherClient theme={theme} className={className} />;
};
