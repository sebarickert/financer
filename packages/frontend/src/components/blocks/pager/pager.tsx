'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { PagerOptions } from './pager.service';

import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { Paragraph } from '$elements/Paragraph';

type PagerProps = {
  className?: string;
  pagerOptions: PagerOptions;
  isStatusHidden?: boolean;
  children?: string;
};

type PagerButtonProps = {
  handleClick(): void;
  children: string;
  isNext?: boolean;
  className?: string;
  isDisabled?: boolean;
};

const PagerButton: FC<PagerButtonProps> = ({
  handleClick,
  children,
  isNext,
  className = '',
  isDisabled,
}) => {
  return (
    <Button
      type="button"
      size="icon"
      className={className}
      onClick={() => handleClick()}
      isDisabled={isDisabled}
      title={children}
      accentColor="secondary"
    >
      <span className="sr-only">{children}</span>
      <Icon name={isNext ? 'ChevronRightIcon' : 'ChevronLeftIcon'} />
    </Button>
  );
};

export const Pager: FC<PagerProps> = ({
  className = '',
  pagerOptions,
  isStatusHidden,
  children,
}) => {
  const { nextPage, previousPage, pageCount, currentPage } = pagerOptions;
  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      {children && <Paragraph>{children}</Paragraph>}
      <PagerButton
        handleClick={previousPage.load}
        isDisabled={!previousPage.isAvailable}
      >
        Previous page
      </PagerButton>
      {!isStatusHidden && currentPage && pageCount && (
        <p className="mx-4 font-medium theme-text-primary">
          <span className="sr-only">
            Current page: {currentPage} of {pageCount}
          </span>
          <span aria-hidden="true">
            {currentPage} / {pageCount}
          </span>
        </p>
      )}
      <PagerButton
        isDisabled={!nextPage.isAvailable}
        handleClick={nextPage.load}
        isNext
      >
        Next page
      </PagerButton>
    </div>
  );
};
