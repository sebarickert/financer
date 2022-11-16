import clsx from 'clsx';

import { PagerOptions } from '../../../hooks/usePager';
import { Icon, IconName } from '../../elements/icon/icon';

interface PagerProps {
  className?: string;
  isCentered?: boolean;
  pagerOptions: PagerOptions;
}

interface PagerButtonProps {
  handleClick(): void;
  children: string;
  isNext?: boolean;
  className?: string;
  isDisabled?: boolean;
}

const PagerButton = ({
  handleClick,
  children,
  isNext,
  className = '',
  isDisabled,
}: PagerButtonProps) => {
  return (
    <button
      className={clsx(
        'h-11 w-11 inline-flex justify-center items-center group disabled:hover:cursor-not-allowed bg-gray border border-gray-dark rounded-full ',
        {
          [className]: true,
          ['hover:bg-gray-dark']: !isDisabled,
        }
      )}
      onClick={handleClick}
      disabled={isDisabled}
      title={children}
    >
      <span className="sr-only">{children}</span>
      <Icon
        type={isNext ? IconName.arrowRight : IconName.arrowLeft}
        className="stroke-gray-darkest group-disabled:opacity-50"
      />
    </button>
  );
};

export const Pager = ({
  className = '',
  isCentered,
  pagerOptions,
}: PagerProps): JSX.Element => {
  const { nextPage, previousPage, pageCount, currentPage } = pagerOptions;
  return (
    <section
      className={clsx({
        [className]: true,
        ['flex justify-center']: isCentered,
        ['inline-flex']: !isCentered,
      })}
    >
      <div className={clsx('inline-flex items-center gap-2')}>
        <PagerButton
          handleClick={previousPage.load}
          isDisabled={!previousPage.isAvailable}
        >
          Previous page
        </PagerButton>
        {currentPage && pageCount && (
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
          className={``}
          isDisabled={!nextPage.isAvailable}
          handleClick={nextPage.load}
          isNext
        >
          Next page
        </PagerButton>
      </div>
    </section>
  );
};
