'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { ThemeSwitcherItem } from './ThemeSwitcherItem';

import { handleUpdateUserTheme } from '@/actions/user/handleUpdateUserTheme';
import { Theme } from '@/api/ssr-financer-api';

interface ThemeSwitcherClientProps {
  className?: string;
  theme: Theme;
}

export const ThemeSwitcherClient: FC<ThemeSwitcherClientProps> = ({
  theme = Theme.AUTO,
  className,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateUserTheme(event.target.value as Theme)
      .then(() => {
        window.location.reload();
      })
      .catch((error: unknown) => {
        console.error('Error updating user theme:', error);
      });
  };

  return (
    <div
      className={clsx(className, 'w-full max-w-xl')}
      data-testid="themeSwitcher"
    >
      <ul className="grid items-center justify-center grid-cols-3 gap-1 px-1 rounded-md bg-layer">
        {Object.values(Theme).map((switcherItem) => (
          <li key={switcherItem}>
            <ThemeSwitcherItem
              onChange={handleChange}
              name={'themeSwitcherItem'}
              value={switcherItem}
              isChecked={theme === switcherItem}
            >
              {switcherItem}
            </ThemeSwitcherItem>
          </li>
        ))}
      </ul>
    </div>
  );
};
