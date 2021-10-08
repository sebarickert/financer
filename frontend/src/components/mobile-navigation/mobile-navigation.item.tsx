import React from 'react';
import { NavLink } from 'react-router-dom';

import { isIOSDevice } from '../../utils/isIOSDevice';
import { Icon, IconName } from '../icon/icon';

interface IMobileNavigationItemProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
  addExtraPaddingIOS?: boolean;
  isExact?: boolean;
  isActive?(match: never, location: { pathname: string }): boolean;
}

export const MobileNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
  addExtraPaddingIOS,
  isExact,
  isActive,
}: IMobileNavigationItemProps): JSX.Element => {
  return (
    <li>
      <NavLink
        to={link}
        exact={isExact}
        className={`flex flex-col items-center justify-center focus:text-blue-financer hover:text-blue-financer ${
          addExtraPaddingIOS && isIOSDevice() ? 'pb-8 pt-4' : 'pb-2 pt-4'
        }`}
        activeClassName="text-blue-financer"
        onClick={onClick}
        aria-label={ariaLabel}
        isActive={isActive}
      >
        <Icon type={iconName} />
        <span className="text-xs mt-1 text-gray-600">{label}</span>
      </NavLink>
    </li>
  );
};
