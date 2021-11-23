import React from 'react';

import { isIOSDevice } from '../../utils/isIOSDevice';
import { isStandaloneMode } from '../../utils/isStandaloneMode';

import { MobileNavigationActions } from './mobile-navigation.actions';
import { MobileNavigationItem } from './mobile-navigation.item';

export const MobileNavigation = (): JSX.Element => {
  return (
    <div className="bg-white fixed bottom-0 left-0 right-0 w-full border-t z-10">
      <nav aria-label="Main navigation in mobile viewmode.">
        <ul
          className={`grid grid-cols-5 relative ${
            isIOSDevice() && isStandaloneMode() ? 'pb-4' : ''
          }`}
        >
          <MobileNavigationItem label="Home" iconName="home" link="/" isExact />
          <MobileNavigationItem
            label="Statistics"
            iconName="chart-bar"
            link="/statistics"
            isActive={(match: never, location: { pathname: string }) =>
              location.pathname.substr(0, 11) === '/statistics' &&
              location.pathname.substr(-4) !== '/add'
            }
          />
          <MobileNavigationActions />
          <MobileNavigationItem
            label="Accounts"
            iconName="view-grid"
            link="/accounts"
          />
          <MobileNavigationItem
            label="Profile"
            iconName="user-circle"
            link="/profile"
          />
        </ul>
      </nav>
    </div>
  );
};
