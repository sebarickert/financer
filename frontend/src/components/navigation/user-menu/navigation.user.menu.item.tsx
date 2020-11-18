import React from "react";
import { NavLink } from "react-router-dom";

interface IProps {
  link: string;
  children: string;
}

const NavigationUserMenuItem = ({ link, children }: IProps): JSX.Element => {
  const elementClasses =
    "block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out";

  if (typeof link === "string" && link.length > 0) {
    if (
      link.substr(0, 8) === "https://" ||
      link.substr(0, 7) === "http://" ||
      link.substr(0, 2) === "//" ||
      link.substr(0, 5) === "blob:" ||
      link.substr(0, 5) === "/api/"
    ) {
      return (
        <a href={link} className={elementClasses} role="menuitem">
          {children}
        </a>
      );
    }
  }

  return (
    <NavLink to={link} className={elementClasses} role="menuitem">
      {children}
    </NavLink>
  );
};

export default NavigationUserMenuItem;
