import clsx from 'clsx';

import { NavigationItem } from './navigation';

import { Icon } from '$elements/icon/icon';
import { LinkViewTransition } from '$elements/link/link-view-transition';
import { useIsActiveLink } from '$hooks/useIsActiveLink';

export const NavigationMobileItem = ({
  url,
  iconName,
  label,
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
        aria-label={ariaLabel}
      >
        <Icon type={iconName} isSolid={isActive} />
        <span className={clsx('sr-only')}>{label}</span>
      </LinkViewTransition>
    </li>
  );
};
