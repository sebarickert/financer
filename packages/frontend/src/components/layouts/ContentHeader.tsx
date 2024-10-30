'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { Heading } from '$elements/Heading';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/Link';

type ContentHeaderProps = {
  title?: string;
  backLink?: string;
  headerAction?: React.ReactNode;
};

export const ContentHeader: FC<ContentHeaderProps> = ({
  title,
  backLink,
  headerAction,
}) => {
  return (
    <header
      className={clsx(
        'max-lg:theme-layer-color text-primary-color max-lg:border-b max-lg:theme-border-primary',
        'max-lg:fixed max-lg:inset-x-0 max-lg:top-0',
        'max-lg:text-center max-lg:px-4 max-lg:h-16',
        'grid items-center grid-cols-[44px,1fr,44px] z-10',
        'lg:flex lg:gap-4 lg:mb-6',
      )}
    >
      {backLink && (
        <Link
          href={backLink}
          className={clsx(
            'inline-flex items-center justify-center h-11 w-11 theme-layer-color-with-hover rounded-md',
          )}
          haptic="light"
          testId="header-back-link"
          transition="slideInFromLeft"
        >
          <span className="sr-only">Go back</span>
          <Icon name="ArrowLeftIcon" />
        </Link>
      )}
      <Heading
        variant="h1"
        className="max-lg:justify-center max-lg:col-[2] lg:grow"
        titleClassName={clsx('truncate')}
        testId="page-main-heading"
      >
        {title ?? '-'}
      </Heading>
      {headerAction}
      {/* {headerAction &&
        isValidElement(headerAction) &&
        cloneElement(headerAction, {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          className: clsx(
            'theme-layer-color-with-hover theme-focus rounded-md',
            'inline-flex items-center justify-center h-11 w-11',
          ),
        })} */}
    </header>
  );
};
