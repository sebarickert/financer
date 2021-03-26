import React from "react";
import { NavLink } from "react-router-dom";

type AccentColor = "pink" | "red" | "green" | "blue";

interface IProps {
  link: string;
  children: string;
  isExact?: boolean;
  accentColor?: AccentColor;
}

const getNavigationMobileMenuItemColorClasses = (
  color: AccentColor
): string => {
  switch (color) {
    case "blue":
      return "border-blue-500 text-blue-700 bg-blue-50 focus:text-blue-800 focus:bg-blue-100 focus:border-blue-700";
    case "green":
      return "border-green-500 text-green-700 bg-green-50 focus:text-green-800 focus:bg-green-100 focus:border-green-700";
    case "pink":
      return "border-pink-500 text-pink-700 bg-pink-50 focus:text-pink-800 focus:bg-pink-100 focus:border-pink-700";
    case "red":
      return "border-red-500 text-red-700 bg-red-50 focus:text-red-800 focus:bg-red-100 focus:border-red-700";
    default:
      return "";
  }
};

const NavigationMobileMenuItem = ({
  link,
  children,
  isExact = false,
  accentColor = "blue",
}: IProps): JSX.Element => {
  return (
    <NavLink
      exact={isExact}
      to={link}
      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
      activeClassName={getNavigationMobileMenuItemColorClasses(accentColor)}
    >
      {children}
    </NavLink>
  );
};

export default NavigationMobileMenuItem;
