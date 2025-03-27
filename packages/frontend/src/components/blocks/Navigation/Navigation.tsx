import clsx from 'clsx';

import { NavigationCreateTransactionButtonSuspense } from './NavigationCreateTransactionButton';
import { NavigationItem } from './NavigationItem';

import { NAVIGATION_ITEMS } from '@/constants/NAVIGATION_ITEMS';

export const Navigation = () => {
  return (
    <nav className="grow">
      <ul
        className={clsx(
          'max-lg:grid max-lg:grid-cols-4',
          'lg:flex lg:gap-4 lg:items-center',
        )}
      >
        <NavigationItem {...NAVIGATION_ITEMS.home} />
        <NavigationItem {...NAVIGATION_ITEMS.transactions} />
        <NavigationItem {...NAVIGATION_ITEMS.accounts} />

        <NavigationCreateTransactionButtonSuspense className="lg:ml-auto" />
      </ul>
    </nav>
  );
};
