import React from "react";
import { NavLink } from "react-router-dom";

interface IProps {
  link: string;
  children: string;
  isExact?: boolean;
  accentColor?: "pink" | "red" | "green" | "blue";
}

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
      activeClassName={`border-${accentColor}-500 text-${accentColor}-700 bg-${accentColor}-50 focus:text-${accentColor}-800 focus:bg-${accentColor}-100 focus:border-${accentColor}-700`}
    >
      {children}
    </NavLink>
  );
};

export default NavigationMobileMenuItem;
