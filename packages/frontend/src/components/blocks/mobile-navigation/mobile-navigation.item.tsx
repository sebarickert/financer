import clsx from 'clsx';

import { useIsActiveLink } from '../../../hooks/useIsActiveLink';
import { IconName, Icon } from '../../elements/icon/icon';

import { LinkViewTransition } from '$elements/link/link-view-transition';

interface MobileNavigationItemProps {
  link: string;
  iconName: IconName;
  label: string;
  onClick?(): void;
  ariaLabel?: string;
  isExact?: boolean;
  disallowedPathEndings?: string[];
  type?: 'standalone' | 'default';
}

export const MobileNavigationItem = ({
  link,
  iconName,
  label,
  onClick = () => {},
  ariaLabel,
  isExact,
  type = 'default',
  disallowedPathEndings,
}: MobileNavigationItemProps): JSX.Element => {
  const isActive = useIsActiveLink({ link, isExact, disallowedPathEndings });

  if (type === 'standalone') {
    return (
      <li>
        <LinkViewTransition
          href={link}
          className={`flex flex-col items-center justify-center focus:text-charcoal hover:text-charcoal h-14`}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          <Icon type={iconName} isSolid={isActive} />
          <span className={clsx('sr-only')}>{label}</span>
        </LinkViewTransition>
      </li>
    );
  }

  return (
    <li>
      <LinkViewTransition
        href={link}
        className={clsx(
          'flex flex-col gap-1 items-center justify-center pt-4 pb-3'
        )}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <span
          className={clsx(
            'h-11 w-11 rounded-full inline-flex items-center justify-center bg-gray-dark text-charcoal'
          )}
        >
          <Icon type={iconName} />
        </span>
        <span className={clsx('text-xs mt-1')}>{label}</span>
      </LinkViewTransition>
    </li>
  );
};
