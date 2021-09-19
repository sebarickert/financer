import React from "react";
import MobileNavigationActions from "./mobile-navigation.actions";
import MobileNavigationItem from "./mobile-navigation.item";

const MobileNavigation = (): JSX.Element => {
  return (
    <div className="bg-white fixed bottom-0 left-0 right-0 w-full border-t">
      <nav aria-label="Main navigation in mobile viewmode.">
        <ul className="grid grid-cols-5 relative">
          <MobileNavigationItem
            label="Home"
            iconName="home"
            link="/"
            addExtraPaddingIOS
          />
          <MobileNavigationItem
            label="Statistics"
            iconName="chart-bar"
            link="/statistics"
            addExtraPaddingIOS
          />
          <MobileNavigationActions />
          <MobileNavigationItem
            label="Accounts"
            iconName="view-grid"
            link="/accounts"
            addExtraPaddingIOS
          />
          <MobileNavigationItem
            label="Profile"
            iconName="user-circle"
            link="/profile"
            addExtraPaddingIOS
          />
        </ul>
      </nav>
    </div>
  );
};

export default MobileNavigation;
