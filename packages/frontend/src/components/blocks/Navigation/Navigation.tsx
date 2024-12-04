import clsx from 'clsx';
import { Activity, Grid2X2, Home, UserCog } from 'lucide-react';
import { FC } from 'react';

import { NavigationCreateTransactionButton } from './NavigationCreateTransactionButton';
import { NavigationItem, NavigationItemProps } from './NavigationItem';

const navigationItems: Record<string, NavigationItemProps> = {
  home: { label: 'Home', url: '/', Icon: Home, isExact: true },
  statistics: {
    label: 'Statistics',
    url: '/statistics/',
    Icon: Activity,
  },
  accounts: {
    label: 'Accounts',
    url: '/accounts/',
    Icon: Grid2X2,
  },
  settings: { label: 'Settings', url: '/settings/', Icon: UserCog },
};

export const Navigation: FC = () => {
  return (
    <nav className="grow">
      <ul
        className={clsx(
          'max-lg:grid max-lg:grid-cols-5',
          'lg:flex lg:gap-4 lg:items-center lg:justify-end',
        )}
      >
        <NavigationItem {...navigationItems.home} />
        <NavigationItem {...navigationItems.statistics} />
        <NavigationItem
          {...navigationItems.accounts}
          className="max-lg:order-4"
        />
        <NavigationItem
          {...navigationItems.settings}
          className="max-lg:order-5"
        />
        <NavigationCreateTransactionButton className="max-lg:order-3" />
      </ul>
    </nav>
  );
};
