import React from "react";
import { NavLink } from "react-router-dom";
import Icon, { IconName } from "../icon/icon";

interface IProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
}

const MobileNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
}: IProps): JSX.Element => {
  return (
    <li>
      <NavLink
        to={link}
        exact
        className="flex flex-col items-center justify-center pb-2 pt-4 focus:text-blue-600 hover:text-blue-600 focus:outline-none focus:ring-blue-600 focus:ring-2 focus:ring-inset"
        activeClassName="text-blue-600"
        onClick={onClick}
      >
        <Icon type={iconName} />
        <span className="text-xs mt-1 text-gray-600">{label}</span>
      </NavLink>
    </li>
  );
};

export default MobileNavigationItem;
