import { NavLink } from 'react-router-dom';

import { useIsActiveLink } from '../../hooks/useIsActiveLink';
import { Icon, IconName } from '../icon/icon';
import { IconSolid } from '../icon/icon.solid';

interface IMobileNavigationItemProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
  isExact?: boolean;
  disallowedPathEndings?: string[];
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
  hasDarkBackground,
  type = 'default',
  disallowedPathEndings,
}: IMobileNavigationItemProps): JSX.Element => {
  const isActive = useIsActiveLink({ link, isExact, disallowedPathEndings });

  if (type === 'standalone') {
    return (
      <li>
        <NavLink
          to={link}
          className={`flex flex-col items-center justify-center focus:text-blue-financer hover:text-blue-financer h-11`}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {!isActive && <Icon type={iconName} />}
          {isActive && (
            <IconSolid type={iconName} className="fill-blue-financer" />
          )}
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
        className={`flex flex-col items-center justify-center pt-4 pb-2 focus:text-blue-financer hover:text-blue-financer ${
          isActive ? 'text-blue-financer after:!bg-blue-financer' : ''
        }`}
        onClick={onClick}
        aria-label={ariaLabel}
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
