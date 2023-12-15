import clsx from 'clsx';

import { useIsActiveLink } from '../../../hooks/useIsActiveLink';
import { Icon } from '../../elements/icon/icon';

import { NavigationItem } from './navigation';

import { LinkViewTransition } from '$elements/link/link-view-transition';

export const NavigationMobileItem = ({
  url,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
  isExact,
  disallowedPathEndings,
}: NavigationItem): JSX.Element => {
  const isActive = useIsActiveLink({ url, isExact, disallowedPathEndings });

  return (
    <li>
      <LinkViewTransition
        href={url}
        className={`flex flex-col items-center justify-center focus:text-charcoal hover:text-charcoal h-14`}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <Icon type={iconName} isSolid={isActive} />
        <span className={clsx('sr-only')}>{label}</span>
      </LinkViewTransition>
    </li>
  );
};
