import React from "react";
import NavigationMobileMenu from "./navigation.mobile.menu";
import NavigationMobileMenuItem from "./navigation.mobile.menu.item";

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
      <div className="pt-4 pb-3 border-t border-gray-200">
        <div className="mt-3">
          <a
            href="/"
            className="mt-1 block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavigationMobile;
