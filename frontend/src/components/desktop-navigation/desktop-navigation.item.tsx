import React from "react";
import { NavLink } from "react-router-dom";
import { isExternalLink } from "../button/button";
import Icon, { IconName } from "../icon/icon";

interface IProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
}

const DesktopNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
}: IProps): JSX.Element => {
  if (isExternalLink(link)) {
    return (
      <li>
        <a
          href={link}
          className="flex items-center py-4 focus:text-blue-financer hover:text-blue-financer"
          aria-label={ariaLabel}
        >
          <Icon type={iconName} />
          <span className="text-sm ml-4 text-gray-600">{label}</span>
        </a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={link}
        exact
        className="flex items-center py-4 focus:text-blue-financer hover:text-blue-financer"
        activeClassName="text-blue-financer border-r-4 border-blue-financer"
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <Icon type={iconName} />
        <span className="text-sm ml-4 text-gray-600">{label}</span>
      </NavLink>
    </li>
  );
};

export default DesktopNavigationItem;
