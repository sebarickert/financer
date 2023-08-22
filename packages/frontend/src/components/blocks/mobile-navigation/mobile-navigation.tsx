import clsx from 'clsx';
import { useState } from 'react';

import { MobileNavigationActions } from './mobile-navigation.actions';
import { MobileNavigationItem } from './mobile-navigation.item';

import { navigationItems } from '$constants/navigation-items';

export const MobileNavigation = (): JSX.Element => {
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-[100] w-full border-t bg-gray border-gray-dark pb-safe vt-name-[mobile-navigation]',
        { ['z-[101]']: isActionsModalOpen }
      )}
    >
      <nav>
        <ul className={`grid grid-cols-5 relative`}>
          <MobileNavigationItem {...navigationItems.home} isExact />
          <MobileNavigationItem
            {...navigationItems.statistics}
            disallowedPathEndings={['add']}
          />
          <MobileNavigationActions
            isActionsModalOpen={isActionsModalOpen}
            setIsActionsModalOpen={setIsActionsModalOpen}
          />
          <MobileNavigationItem {...navigationItems.accounts} />
          <MobileNavigationItem {...navigationItems.settings} />
        </ul>
      </nav>
    </div>
  );
};
