import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, IconName } from '../icon/icon';

interface IMobileNavigationItemProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
  isExact?: boolean;
  isActive?(match: never, location: { pathname: string }): boolean;
  hasDarkBackground?: boolean;
  type?: 'standalone' | 'default';
}

export const MobileNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
  isExact,
  isActive,
  hasDarkBackground,
  type = 'default',
}: IMobileNavigationItemProps): JSX.Element => {
  if (type === 'standalone') {
    return (
      <li>
        <NavLink
          to={link}
          exact={isExact}
          className="flex flex-col items-center justify-center focus:text-blue-financer hover:text-blue-financer pt-4 pb-3 after:h-1.5 after:w-1.5 after:bg-transparent after:rounded-full after:mt-1"
          activeClassName="text-blue-financer after:!bg-blue-financer"
          onClick={onClick}
          aria-label={ariaLabel}
          isActive={isActive}
        >
          <Icon type={iconName} />
          <span
            className={`text-xs mt-1 sr-only ${
              hasDarkBackground ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {label}
          </span>
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={link}
        exact={isExact}
        className="flex flex-col items-center justify-center focus:text-blue-financer hover:text-blue-financer pt-4 pb-2"
        activeClassName="text-blue-financer after:!bg-blue-financer"
        onClick={onClick}
        aria-label={ariaLabel}
        isActive={isActive}
      >
        <Icon type={iconName} />
        <span
          className={`text-xs mt-1 ${
            hasDarkBackground ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {label}
        </span>
      </NavLink>
    </li>
  );
};
