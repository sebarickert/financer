import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

import { useIsActiveLink } from '../../hooks/useIsActiveLink';
import { isExternalLink } from '../button/button';
import { Icon, IconName } from '../icon/icon';

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

  const linkClasses = clsx(
    'flex items-center p-4 hover:bg-gray-dark rounded-md tracking-tight font-medium',
    {
      ['bg-gray-dark']: isActive,
    }
  );

  const linkContent = (
    <>
      <Icon type={iconName} isSolid={isActive} />
      <span className={clsx('ml-4 text-base')}>{label}</span>
    </>
  );

  if (isExternalLink(link)) {
    return (
      <li>
        <a href={link} className={linkClasses} aria-label={ariaLabel}>
          {linkContent}
        </a>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={link}
        className={linkClasses}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {linkContent}
      </NavLink>
    </li>
  );
};
