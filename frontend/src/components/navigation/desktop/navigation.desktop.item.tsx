import React from "react";
import { NavLink } from "react-router-dom";

type AccentColor = "pink" | "red" | "green" | "blue";

interface IProps {
  location: string;
  children: string;
  isExact?: boolean;
  accentColor?: AccentColor;
}

const getNavigationDesktopMenuItemColorClasses = (
  color: AccentColor
): string => {
  switch (color) {
    case "blue":
      return "border-blue-500 focus:border-blue-700";
    case "green":
      return "border-green-500 focus:border-green-700";
    case "pink":
      return "border-pink-500 focus:border-pink-700";
    case "red":
      return "border-red-500 focus:border-red-700";
    default:
      return "";
  }
};

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
      activeClassName={`text-gray-900 ${getNavigationDesktopMenuItemColorClasses(
        accentColor
      )}`}
    >
      {children}
    </NavLink>
  );
};

export default NavigationDesktopItem;
