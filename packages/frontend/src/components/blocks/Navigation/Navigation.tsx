import clsx from 'clsx';
import { FC } from 'react';

import { NavigationCreateTransactionButton } from './NavigationCreateTransactionButton';
import { NavigationItem, NavigationItemProps } from './NavigationItem';

const navigationItems: Record<string, NavigationItemProps> = {
  home: { label: 'Home', url: '/', iconName: 'HomeIcon', isExact: true },
  statistics: {
    label: 'Statistics',
    url: '/statistics',
    iconName: 'ChartBarIcon',
  },
  accounts: {
    label: 'Accounts',
    url: '/accounts',
    iconName: 'Squares2X2Icon',
  },
  settings: { label: 'Settings', url: '/settings', iconName: 'Cog8ToothIcon' },
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
