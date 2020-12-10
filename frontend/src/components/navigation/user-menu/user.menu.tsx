import React from "react";
import UserMenuDesktop from "./user.menu.desktop";
import UserMenuMobile from "./user.menu.mobile";
import UserMenuItem from "./user.menu.item";

interface IProps {
  type: "mobile" | "desktop";
}

const UserMenu = ({ type }: IProps): JSX.Element => {
  if (type === "desktop") {
    return (
      <UserMenuDesktop>
        <UserMenuItem link="/profile" type="desktop">
          Profile
        </UserMenuItem>
        <UserMenuItem link="/auth/logout" type="desktop">
          Sign out
        </UserMenuItem>
      </UserMenuDesktop>
    );
  }

  return (
    <UserMenuMobile>
      <UserMenuItem link="/profile" type="mobile">
        Profile
      </UserMenuItem>
      <UserMenuItem link="/auth/logout" type="mobile">
        Sign out
      </UserMenuItem>
    </UserMenuMobile>
  );
};

export default UserMenu;
