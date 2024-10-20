'use server';

import clsx from 'clsx';
import { headers } from 'next/headers';
import { FC } from 'react';

import { NavigationItem } from './navigation';

import { Icon } from '$elements/Icon';
import { Link } from '$elements/link/link';
import { isActiveLink } from '$utils/is-link-active';
import { CustomHeader } from 'src/types/custom-headers';

export const NavigationDesktopItem: FC<NavigationItem> = async ({
  url,
  iconName,
  label,
  ariaLabel,
  isExact = false,
  disallowedPathEndings = [],
}) => {
  const headerList = headers();

  const isActive = isActiveLink({
    pathname: headerList.get(CustomHeader.PATHNAME) as string,
    url,
    isExact,
    disallowedPathEndings,
  });

  const linkClasses = clsx(
    'flex items-center p-4 hover:bg-gray-dark rounded-md',
    {
      ['bg-gray-dark font-medium']: isActive,
    },
  );

  return (
    <li>
      <Link href={url} className={linkClasses} aria-label={ariaLabel}>
        <Icon name={iconName} isSolid={isActive} />
        <span className={clsx('ml-4 text-base')}>{label}</span>
      </Link>
    </li>
  );
};
