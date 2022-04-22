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
      className={`p-4 group disabled:hover:cursor-not-allowed hover:not() ${className} ${
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
      <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg">
        <PagerButton
          handleClick={previousPage.load}
          isDisabled={!previousPage.isAvailable}
        >
          Previous page
        </PagerButton>
        <p className="px-8 py-4">
          <span className="sr-only">
            Current page: {currentPage} of {pageCount}
          </span>
          <span aria-hidden="true">
            {currentPage} / {pageCount}
          </span>
        </p>
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
