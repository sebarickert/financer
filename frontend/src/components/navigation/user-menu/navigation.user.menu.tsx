import React, { useState } from "react";
import NavigationUserMenuItem from "./navigation.user.menu.item";
import NavigationUserMenuToggle from "./navigation.user.menu.toggle";
import NavigationUserMenuContainer from "./navigation.user.menu.container";

interface IProps {
  children?: React.ReactNode;
}

const NavigationUserMenu = ({ children }: IProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <div className="relative">
        <NavigationUserMenuToggle isOpen={isOpen} handleToggle={setIsOpen} />
        <NavigationUserMenuContainer isOpen={isOpen}>
          <NavigationUserMenuItem link="/api/auth/logout">
            Sign out
          </NavigationUserMenuItem>
        </NavigationUserMenuContainer>
      </div>
    </div>
  );
};

export default NavigationUserMenu;
