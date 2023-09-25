import clsx from 'clsx';

import { useIsActiveLink } from '../../../hooks/useIsActiveLink';
import { isExternalLink } from '../../elements/button/button';
import { IconName, Icon } from '../../elements/icon/icon';

import { LinkViewTransition } from '$elements/link/link-view-transition';

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
      <LinkViewTransition
        href={link}
        className={linkClasses}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {linkContent}
      </LinkViewTransition>
    </li>
  );
};
