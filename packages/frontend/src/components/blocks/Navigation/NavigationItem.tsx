import clsx from 'clsx';
import { FC } from 'react';

import { NavigationItem as NavigationItemType } from '$constants/NAVIGATION_ITEMS';
import { Link } from '$elements/Link';

export type NavigationItemProps = NavigationItemType & {
  className?: string;
};

export const NavigationItem: FC<NavigationItemProps> = ({
  url,
  label,
  Icon,
  className,
}) => {
  return (
    <li className={clsx(className)}>
      <Link
        haptic="heavy"
        href={url}
        className={clsx(
          'items-center justify-center',
          'max-lg:flex max-lg:flex-col max-lg:h-14',
          'lg:inline-flex lg:gap-2 lg:py-5 lg:px-4 lg:font-medium lg:text-muted-foreground',
          'lg:hover:text-foreground lg:active:text-foreground lg:transition-colors',
          'aria-[current=page]:max-lg:shadow-[inset_0_2px] aria-[current=page]:lg:shadow-[inset_0_-2px] aria-[current=page]:!shadow-blue aria-[current=page]:lg:text-foreground',
          '[&[data-active-sub-page="true"]]:max-lg:shadow-[inset_0_2px] [&[data-active-sub-page="true"]]:lg:shadow-[inset_0_-2px] [&[data-active-sub-page="true"]]:!shadow-blue [&[data-active-sub-page="true"]]:lg:text-foreground',
        )}
        hasHoverEffect={false}
      >
        <Icon />
        <span className="max-lg:sr-only">{label}</span>
      </Link>
    </li>
  );
};
