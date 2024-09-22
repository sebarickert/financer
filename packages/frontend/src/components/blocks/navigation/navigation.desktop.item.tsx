'use server';

import clsx from 'clsx';
import { headers } from 'next/headers';
import { FC } from 'react';

import { NavigationItem } from './navigation';

import { isExternalLink } from '$elements/button/is-external-link';
import { Icon } from '$elements/icon/icon';
import { LinkViewTransition } from '$elements/link/link-view-transition';
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
    'flex items-center p-4 hover:bg-gray-dark rounded-md tracking-tight font-medium',
    {
      ['bg-gray-dark']: isActive,
    },
  );

  const linkContent = (
    <>
      <Icon type={iconName} isSolid={isActive} />
      <span className={clsx('ml-4 text-base')}>{label}</span>
    </>
  );

  if (isExternalLink(url)) {
    return (
      <li>
        <a href={url} className={linkClasses} aria-label={ariaLabel}>
          {linkContent}
        </a>
      </li>
    );
  }

  return (
    <li>
      <LinkViewTransition
        href={url}
        className={linkClasses}
        aria-label={ariaLabel}
      >
        {linkContent}
      </LinkViewTransition>
    </li>
  );
};
