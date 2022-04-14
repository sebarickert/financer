import { IconName } from '../icon/icon';

import { MobileNavigationActions } from './mobile-navigation.actions';
import { MobileNavigationItem } from './mobile-navigation.item';

export const MobileNavigation = (): JSX.Element => {
  return (
    <div className="fixed bottom-0 pb-safe left-0 right-0 z-10 w-full bg-white border-t">
      <nav aria-label="Main navigation in mobile viewmode.">
        <ul className={`grid grid-cols-5 relative`}>
          <MobileNavigationItem
            label="Home"
            iconName={IconName.home}
            link="/"
            isExact
            type="standalone"
          />
          <MobileNavigationItem
            label="Statistics"
            iconName={IconName.chartBar}
            link="/statistics"
            disallowedPathEndings={['add']}
            type="standalone"
          />
          <MobileNavigationActions />
          <MobileNavigationItem
            label="Accounts"
            iconName={IconName.viewGrid}
            link="/accounts"
            type="standalone"
          />
          <MobileNavigationItem
            label="Profile"
            iconName={IconName.userCircle}
            link="/profile"
            type="standalone"
          />
        </ul>
      </nav>
    </div>
  );
};
