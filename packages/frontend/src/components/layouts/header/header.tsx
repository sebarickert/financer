'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { usePageInfoContext } from '$context/pageInfoContext';
import { Heading } from '$elements/heading/heading';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/link/link';
import { useAppSelector } from '$store';

type HeaderProps = {
  title?: string;
};

export const Header: FC<HeaderProps> = ({ title }) => {
  const [{ backLink, headerAction }] = usePageInfoContext();

  const { isHeaderActionActive } = useAppSelector((state) => state.app);

  const hasBackLinkAndOrAction = !!backLink || !!headerAction;

  return (
    <div
      className={clsx(
        'max-lg:text-center max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:px-4 max-lg:h-16 max-lg:border-b max-lg:bg-white',
        'grid items-center grid-cols-[44px,1fr,44px] z-10',
        'lg:flex lg:gap-4 lg:mb-6',
        {
          ['max-lg:border-b-transparent']: !hasBackLinkAndOrAction,
          ['max-lg:border-b-gray-dark']: hasBackLinkAndOrAction,
          ['max-lg:z-[101]']: isHeaderActionActive,
        },
      )}
    >
      {backLink && (
        <Link
          href={backLink}
          className="inline-flex items-center justify-center -ml-3 h-11 w-11"
          testId="header-back-link"
          transition="slideInFromLeft"
        >
          <span className="sr-only">Go back</span>
          <Icon name="ArrowLeftIcon" />
        </Link>
      )}
      <Heading
        variant="h1"
        className="max-lg:justify-center max-lg:col-[2]"
        titleClassName={clsx('truncate')}
        testId="page-main-heading"
      >
        {title ?? '-'}
      </Heading>
      {headerAction && (
        <div className="max-lg:inline-flex max-lg:items-center max-lg:justify-end max-lg:h-11 max-lg:w-11 max-lg:col-[3] lg:ml-auto">
          {headerAction}
        </div>
      )}
    </div>
  );
};
