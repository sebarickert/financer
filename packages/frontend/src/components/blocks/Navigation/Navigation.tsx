import clsx from 'clsx';

import { NavigationItem } from './NavigationItem';

import { NavigationCreateTransactionButton } from '@/blocks/Navigation/NavigationCreateTransactionButton';
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

        <NavigationCreateTransactionButton className="lg:ml-auto" />
      </ul>
    </nav>
  );
};
