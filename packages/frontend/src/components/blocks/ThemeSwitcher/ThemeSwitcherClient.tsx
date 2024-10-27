'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { ThemeSwitcherItem } from './ThemeSwitcherItem';

import {
  Theme,
  useUsersUpdateOwnUserMutation,
} from '$api/generated/financerApi';
import { clearUserCache } from '$ssr/api/clear-cache';

type ThemeSwitcherClientProps = {
  className?: string;
  theme: Theme;
};

export const ThemeSwitcherClient: FC<ThemeSwitcherClientProps> = ({
  theme = Theme.Auto,
  className,
}) => {
  const [updateUser] = useUsersUpdateOwnUserMutation();

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await updateUser({
      updateUserOwnUserDto: {
        theme: event.target.value as Theme,
      },
    }).unwrap();

    await clearUserCache();
    window.location.reload();
  };

  return (
    <div className={clsx(className)} data-testid="themeSwitcher">
      <ul className="grid items-center justify-center grid-cols-3 gap-0.5 p-1 rounded-lg theme-layer-color">
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