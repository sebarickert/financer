import React, { useState } from "react";
import NavigationContainer from "./navigation.container";
import NavigationDesktop from "./desktop/navigation.desktop";
import NavigationDesktopItem from "./desktop/navigation.desktop.item";
import NavigationLogo from "./navigation.logo";
import NavigationMobile from "./mobile/navigation.mobile";
import NavigationMobileToggle from "./mobile/navigation.mobile.toggle";
import UserMenu from "./user-menu/user.menu";

const Navigation = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <NavigationContainer>
      <div className="flex justify-between h-16">
        {/* Desktop navigation */}
        <div className="flex">
          <NavigationLogo />
          <NavigationDesktop>
            <NavigationDesktopItem isExact accentColor="pink" location="/">
              Dashboard
            </NavigationDesktopItem>
            <NavigationDesktopItem accentColor="green" location="/incomes">
              Incomes
            </NavigationDesktopItem>
            <NavigationDesktopItem accentColor="red" location="/expenses">
              Expenses
            </NavigationDesktopItem>
            <NavigationDesktopItem accentColor="blue" location="/accounts">
              Accounts
            </NavigationDesktopItem>
          </NavigationDesktop>
        </div>
        <UserMenu type="desktop" />
        <NavigationMobileToggle
          isOpen={isMobileMenuOpen}
          handleToggleMenu={setIsMobileMenuOpen}
        />
      </div>
      {/* Mobile navigation */}
      <NavigationMobile isOpen={isMobileMenuOpen} />
    </NavigationContainer>
  );
};

export default Navigation;
