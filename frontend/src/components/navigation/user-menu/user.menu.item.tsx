import React from "react";
import { NavLink } from "react-router-dom";
import { isExternalLink } from "../../button/button";

interface IProps {
  type: "mobile" | "desktop";
  link: string;
  children: string;
}

const UserMenuItem = ({ type, link, children }: IProps): JSX.Element => {
  const elementClasses = {
    mobile:
      "mt-1 block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out",
    desktop:
      "block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out",
  };

  if (isExternalLink(link)) {
    return (
      <a href={link} className={elementClasses[type]} role="menuitem">
        {children}
      </a>
    );
  }

  return (
    <NavLink to={link} className={elementClasses[type]} role="menuitem">
      {children}
    </NavLink>
  );
};

export default UserMenuItem;
