import React from "react";
import { NavLink } from "react-router-dom";
import Icon, { IconName } from "../icon/icon";

interface IProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
}

const MobileNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
}: IProps): JSX.Element => {
  return (
    <li>
      <NavLink
        to={link}
        exact
        className="flex flex-col items-center justify-center pb-2 pt-4 focus:text-blue-financer hover:text-blue-financer"
        activeClassName="text-blue-financer"
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <Icon type={iconName} />
        <span className="text-xs mt-1 text-gray-600">{label}</span>
      </NavLink>
    </li>
  );
};

export default MobileNavigationItem;
