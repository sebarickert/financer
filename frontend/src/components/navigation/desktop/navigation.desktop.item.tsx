import React from "react";
import { NavLink } from "react-router-dom";

interface IProps {
  location: string;
  children: string;
  isExact?: boolean;
  accentColor?: "pink" | "red" | "green" | "blue";
}

const NavigationDesktopItem = ({
  location,
  children,
  isExact = false,
  accentColor = "blue",
}: IProps): JSX.Element => {
  return (
    <NavLink
      exact={isExact}
      to={location}
      className="mr-8 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
      activeClassName={`border-${accentColor}-500 text-gray-900 focus:border-${accentColor}-700`}
    >
      {children}
    </NavLink>
  );
};

export default NavigationDesktopItem;
