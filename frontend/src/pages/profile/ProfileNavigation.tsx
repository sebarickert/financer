import React from 'react';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';

import { isExternalLink } from '../../components/button/button';

interface IProfileNavigationItemProps {
  link: string;
  children: string;
}

interface IProfileNavigationProps {
  userRoles?: string[];
}

export const ProfileNavigationItem = ({
  link,
  children,
}: IProfileNavigationItemProps): JSX.Element => {
  const resolved = useResolvedPath(link);
  const match = useMatch({ path: resolved.pathname, end: true });

  const isActive = Boolean(match);

  const linkClasses = {
    default:
      'text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center px-3 py-2 text-sm font-medium rounded-md',
    active: 'bg-gray-200 text-gray-900 hover:bg-gray-200',
  };

  if (isExternalLink(link)) {
    return (
      <li>
        <a href={link} className={linkClasses.default} role="menuitem">
          <span className="truncate">{children}</span>
        </a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={link}
        className={`${linkClasses.default} ${
          isActive ? linkClasses.active : ''
        }`}
        role="menuitem"
      >
        <span className="truncate">{children}</span>
      </NavLink>
    </li>
  );
};

export const ProfileNavigation = ({
  userRoles,
}: IProfileNavigationProps): JSX.Element => {
  return (
    <nav className="w-full">
      <ul className="space-y-1">
        <ProfileNavigationItem link="/profile">
          Profile information
        </ProfileNavigationItem>
        <ProfileNavigationItem link="/profile/transaction-categories">
          Transaction categories
        </ProfileNavigationItem>
        {userRoles?.includes('test-user') && (
          <ProfileNavigationItem link="/profile/override-data">
            Override profile data
          </ProfileNavigationItem>
        )}
        <ProfileNavigationItem link="/api/profile/my-data">
          Download my data
        </ProfileNavigationItem>
      </ul>
    </nav>
  );
};
