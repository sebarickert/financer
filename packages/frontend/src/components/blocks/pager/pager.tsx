'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { PagerOptions } from './pager.service';

import { Icon } from '$elements/Icon';
import { Paragraph } from '$elements/paragraph/paragraph';

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
    <button
      type="button"
      className={clsx(
        'h-11 w-11 rounded-md',
        'theme-focus theme-layer-color-with-hover theme-text-primary',
        'inline-flex justify-center items-center',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      onClick={() => handleClick()}
      disabled={isDisabled}
      title={children}
    >
      <span className="sr-only">{children}</span>
      <Icon name={isNext ? 'ChevronRightIcon' : 'ChevronLeftIcon'} />
    </button>
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
