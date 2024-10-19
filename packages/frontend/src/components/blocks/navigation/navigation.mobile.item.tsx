import clsx from 'clsx';

import { NavigationItem } from './navigation';

import { Icon } from '$elements/Icon';
import { Link } from '$elements/link/link';
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
      <Link
        href={url}
        className={`flex flex-col items-center justify-center focus:text-charcoal hover:text-charcoal h-14`}
        aria-label={ariaLabel}
      >
        <Icon name={iconName} isSolid={isActive} />
        <span className={clsx('sr-only')}>{label}</span>
      </Link>
    </li>
  );
};
