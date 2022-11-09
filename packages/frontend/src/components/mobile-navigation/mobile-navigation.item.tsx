import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { useIsActiveLink } from '../../hooks/useIsActiveLink';
import { Icon, IconName } from '../icon/icon';

interface MobileNavigationItemProps {
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
}: MobileNavigationItemProps): JSX.Element => {
  const isActive = useIsActiveLink({ link, isExact, disallowedPathEndings });

  if (type === 'standalone') {
    return (
      <li>
        <NavLink
          to={link}
          className={`flex flex-col items-center justify-center focus:text-blue-financer hover:text-blue-financer h-14`}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          <Icon type={iconName} isSolid={isActive} />
          <span
            className={clsx('text-xs mt-1 sr-only', {
              ['text-gray-300']: hasDarkBackground,
              ['text-gray-600']: !hasDarkBackground,
            })}
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
        className={clsx(
          'flex flex-col gap-1 items-center justify-center pt-4 pb-2 focus:text-blue-financer hover:text-blue-financer',
          {
            ['text-blue-financer after:!bg-blue-financer']: isActive,
          }
        )}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <span
          className={clsx(
            'h-11 w-11 rounded-full inline-flex items-center justify-center',
            {
              ['bg-gray-800']: hasDarkBackground,
              ['bg-gray-50']: !hasDarkBackground,
            }
          )}
        >
          <Icon type={iconName} />
        </span>
        <span
          className={clsx('text-xs mt-1', {
            ['text-gray-300']: hasDarkBackground,
            ['text-gray-600']: !hasDarkBackground,
          })}
        >
          {label}
        </span>
      </NavLink>
    </li>
  );
};
