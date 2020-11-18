import React from "react";
import NavigationMobileMenu from "./navigation.mobile.menu";
import NavigationMobileMenuItem from "./navigation.mobile.menu.item";
import UserMenu from "../user-menu/user.menu";

interface IProps {
  isOpen: boolean;
}

const NavigationMobile = ({ isOpen }: IProps): JSX.Element => {
  return (
    <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
      <NavigationMobileMenu>
        <NavigationMobileMenuItem isExact link="/" accentColor="pink">
          Dashboard
        </NavigationMobileMenuItem>
        <NavigationMobileMenuItem link="/incomes" accentColor="green">
          Incomes
        </NavigationMobileMenuItem>
        <NavigationMobileMenuItem link="/expenses" accentColor="red">
          Expenses
        </NavigationMobileMenuItem>
        <NavigationMobileMenuItem link="/accounts" accentColor="blue">
          Accounts
        </NavigationMobileMenuItem>
      </NavigationMobileMenu>
      <UserMenu type="mobile" />
    </div>
  );
};

export default NavigationMobile;
