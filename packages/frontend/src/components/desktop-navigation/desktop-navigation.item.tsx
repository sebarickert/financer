import { NavLink } from 'react-router-dom';

import { useIsActiveLink } from '../../hooks/useIsActiveLink';
import { isExternalLink } from '../button/button';
import { Icon, IconName } from '../icon/icon';
import { IconSolid } from '../icon/icon.solid';

interface IDesktopNavigationItemProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
  isExact?: boolean;
  disallowedPathEndings?: string[];
}

export const DesktopNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
  isExact = false,
  disallowedPathEndings = [],
}: IDesktopNavigationItemProps): JSX.Element => {
  const isActive = useIsActiveLink({ link, isExact, disallowedPathEndings });

  if (isExternalLink(link)) {
    return (
      <li>
        <a
          href={link}
          className="flex items-center py-4 focus:text-blue-financer hover:text-blue-financer"
          aria-label={ariaLabel}
        >
          <Icon type={iconName} />
          <span className="ml-4 text-sm text-gray-600">{label}</span>
        </a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={link}
        className={`flex items-center py-4 focus:text-blue-financer hover:text-blue-financer ${
          isActive ? 'text-blue-financer border-r-4 border-blue-financer' : ''
        }`}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <Icon type={iconName} />
        <span className="ml-4 text-sm text-gray-600">{label}</span>
      </NavLink>
    </li>
  );
};
