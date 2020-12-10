import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserMenuDesktopToggle from "./user.menu.desktop.toggle";
import UserMenuDesktopItems from "./user.menu.desktop.items";

interface IProps {
  children: React.ReactNode;
}

const UserMenuDesktop = ({ children }: IProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <div className="relative">
        <UserMenuDesktopToggle isOpen={isOpen} handleToggle={setIsOpen} />
        <UserMenuDesktopItems isOpen={isOpen}>{children}</UserMenuDesktopItems>
      </div>
    </div>
  );
};

export default UserMenuDesktop;
