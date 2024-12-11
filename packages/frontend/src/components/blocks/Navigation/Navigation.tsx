import clsx from 'clsx';
import { FC } from 'react';

import { NavigationCreateTransactionButtonSuspense } from './NavigationCreateTransactionButton';
import { NavigationItem } from './NavigationItem';

import { NAVIGATION_ITEMS } from '$constants/NAVIGATION_ITEMS';

type NavigationProps = {
  isLoading?: boolean;
};

export const Navigation: FC<NavigationProps> = ({ isLoading }) => {
  return (
    <nav className="grow">
      <ul
        className={clsx(
          'max-lg:grid max-lg:grid-cols-5',
          'lg:flex lg:gap-4 lg:items-center lg:justify-end',
        )}
      >
        <NavigationItem {...NAVIGATION_ITEMS.home} />
        <NavigationItem {...NAVIGATION_ITEMS.statistics} />
        <NavigationItem
          {...NAVIGATION_ITEMS.accounts}
          className="max-lg:order-4"
        />
        <NavigationItem
          {...NAVIGATION_ITEMS.settings}
          className="max-lg:order-5"
        />

        <NavigationCreateTransactionButtonSuspense
          className="max-lg:order-3"
          isLoading={isLoading}
        />
      </ul>
    </nav>
  );
};
