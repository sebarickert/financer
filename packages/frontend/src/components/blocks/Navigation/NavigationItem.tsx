'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { Icon, IconName } from '$elements/Icon';
import { Link } from '$elements/Link';
import { useIsActiveLink } from '$hooks/useIsActiveLink';

export type NavigationItemProps = {
  url: string;
  label: string;
  iconName: IconName;
  isExact?: boolean;
  className?: string;
};

export const NavigationItem: FC<NavigationItemProps> = ({
  url,
  label,
  iconName,
  isExact,
  className,
}) => {
  const isActive = useIsActiveLink({ url, isExact });

  return (
    <li className={clsx(className)}>
      <Link
        haptic="heavy"
        href={url}
        className={clsx(
          'items-center justify-center theme-focus',
          'max-lg:flex max-lg:flex-col max-lg:h-14',
          'lg:inline-flex lg:gap-2 lg:py-3 lg:px-5 lg:border lg:rounded-md',
          'lg:hover:theme-border-primary lg:hover:theme-layer-secondary-color',
          {
            [`lg:theme-layer-secondary-color lg:theme-border-primary lg:font-medium`]:
              isActive,
          },
          {
            [`lg:border-transparent`]: !isActive,
          },
        )}
      >
        <Icon name={iconName} isSolid={isActive} />
        <span className="max-lg:sr-only">{label}</span>
      </Link>
    </li>
  );
};
