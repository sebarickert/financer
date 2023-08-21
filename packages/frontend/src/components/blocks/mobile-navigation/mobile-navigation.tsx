import { MobileNavigationActions } from './mobile-navigation.actions';
import { MobileNavigationItem } from './mobile-navigation.item';

import { navigationItems } from '$constants/navigation-items';

export const MobileNavigation = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full border-t bg-gray border-gray-dark pb-safe vt-name-[mobile-navigation]">
      <nav>
        <ul className={`grid grid-cols-5 relative`}>
          <MobileNavigationItem {...navigationItems.home} isExact />
          <MobileNavigationItem
            {...navigationItems.statistics}
            disallowedPathEndings={['add']}
          />
          <MobileNavigationActions />
          <MobileNavigationItem {...navigationItems.accounts} />
          <MobileNavigationItem {...navigationItems.settings} />
        </ul>
      </nav>
    </div>
  );
};
