import { PagerOptions } from '../../hooks/usePager';
import { Icon, IconName } from '../icon/icon';

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
      className={`h-11 w-11 inline-flex justify-center items-center group disabled:hover:cursor-not-allowed ${className} ${
        !isDisabled ? 'hover:bg-gray-50' : ''
      }`}
      onClick={handleClick}
      disabled={isDisabled}
      title={children}
    >
      <span className="sr-only">{children}</span>
      <Icon
        type={isNext ? IconName.arrowRight : IconName.arrowLeft}
        className="group-disabled:opacity-50"
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
      className={`${
        isCentered ? 'flex justify-center' : 'inline-flex'
      } ${className}`}
    >
      <div
        className={`inline-flex overflow-hidden items-center bg-white border rounded-md ${
          !currentPage && !pageCount ? 'divide-x' : ''
        }`}
      >
        <PagerButton
          handleClick={previousPage.load}
          isDisabled={!previousPage.isAvailable}
        >
          Previous page
        </PagerButton>
        {currentPage && pageCount && (
          <p className="px-8 h-11 border-l border-r inline-flex items-center">
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
