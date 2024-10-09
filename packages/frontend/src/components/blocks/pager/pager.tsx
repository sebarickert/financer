'use client';

import clsx from 'clsx';
import { FC } from 'react';

import { PagerOptions } from './pager.service';

import { Icon } from '$elements/icon/icon.new';

interface PagerProps {
  className?: string;
  pagerOptions: PagerOptions;
  children?: string;
  isStatusHidden?: boolean;
}

interface PagerButtonProps {
  handleClick(): void;
  children: string;
  isNext?: boolean;
  className?: string;
  isDisabled?: boolean;
}

const PagerButton: FC<PagerButtonProps> = ({
  handleClick,
  children,
  isNext,
  className = '',
  isDisabled,
}) => {
  return (
    <button
      className={clsx(
        'h-11 w-11 inline-flex justify-center items-center group disabled:hover:cursor-not-allowed',
        {
          [className]: true,
        },
      )}
      onClick={() => handleClick()}
      disabled={isDisabled}
      title={children}
    >
      <span className="sr-only">{children}</span>
      <Icon
        name={isNext ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
        className="stroke-black group-disabled:opacity-50"
      />
    </button>
  );
};

export const Pager: FC<PagerProps> = ({
  className = '',
  pagerOptions,
  children,
  isStatusHidden,
}) => {
  const { nextPage, previousPage, pageCount, currentPage } = pagerOptions;
  return (
    <section
      className={clsx({
        [className]: true,
      })}
    >
      <div className="grid grid-cols-[auto,1fr,auto] gap-2 items-center text-center">
        <PagerButton
          handleClick={previousPage.load}
          isDisabled={!previousPage.isAvailable}
          className="-ml-4"
        >
          Previous page
        </PagerButton>
        {children && <p>{children}</p>}
        {!isStatusHidden && currentPage && pageCount && (
          <p className="mx-4 font-medium tracking-tight text-charcoal">
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
          className="col-[3] -mr-4"
        >
          Next page
        </PagerButton>
      </div>
    </section>
  );
};
