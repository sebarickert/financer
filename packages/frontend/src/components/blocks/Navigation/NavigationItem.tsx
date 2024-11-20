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
          'items-center justify-center',
          'max-lg:flex max-lg:flex-col max-lg:h-14',
          'lg:inline-flex lg:gap-2 lg:py-5 lg:px-4 lg:font-medium',
          'lg:hover:text-foreground lg:transition-colors',
          {
            ['max-lg:shadow-[inset_0_2px] lg:shadow-[inset_0_-2px] !shadow-blue']:
              isActive,
            'lg:text-muted-foreground': !isActive,
          },
        )}
        hasHoverEffect={false}
      >
        <Icon name={iconName} isSolid={isActive} />
        <span className="max-lg:sr-only">{label}</span>
      </Link>
    </li>
  );
};
