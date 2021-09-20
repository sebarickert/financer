import React from "react";
import { NavLink } from "react-router-dom";
import Icon, { IconName } from "../icon/icon";
import isIOSDevice from "../../utils/isIOSDevice";

interface IProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
  addExtraPaddingIOS?: boolean;
  isExact?: boolean;
}

const MobileNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
  addExtraPaddingIOS,
  isExact,
}: IProps): JSX.Element => {
  return (
    <li>
      <NavLink
        to={link}
        exact={isExact}
        className={`flex flex-col items-center justify-center focus:text-blue-financer hover:text-blue-financer ${
          addExtraPaddingIOS && isIOSDevice() ? "pb-8 pt-4" : "pb-2 pt-4"
        }`}
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
