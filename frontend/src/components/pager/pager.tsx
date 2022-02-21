import { Icon } from '../icon/icon';

interface PagerProps {
  pageCount: number;
  currentPage: number;
  className?: string;
  handlePageUpdate(pageNumber: number): void;
  isCentered?: boolean;
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
        type={isNext ? 'arrow-right' : 'arrow-left'}
        className="group-disabled:opacity-50"
      />
    </button>
  );
};

export const Pager = ({
  pageCount,
  currentPage,
  className = '',
  handlePageUpdate,
  isCentered,
}: PagerProps): JSX.Element => {
  const handlePagerPreviousClick = () => {
    if (currentPage !== 0) {
      handlePageUpdate(currentPage - 1);
    }
  };

  const handlePagerNextClick = () => {
    if (currentPage + 1 !== pageCount) {
      handlePageUpdate(currentPage + 1);
    }
  };

  return (
    <section
      className={`${
        isCentered ? 'flex justify-center' : 'inline-flex'
      } ${className}`}
    >
      <div className="inline-flex bg-white border rounded-lg overflow-hidden divide-x">
        <PagerButton
          handleClick={handlePagerPreviousClick}
          isDisabled={currentPage === 0}
        >
          Previous page
        </PagerButton>
        <p className="py-4 px-8">
          <span className="sr-only">
            Current page: {currentPage + 1} of {pageCount}
          </span>
          <span aria-hidden="true">
            {currentPage + 1} / {pageCount}
          </span>
        </p>
        <PagerButton
          className={``}
          isDisabled={currentPage + 1 === pageCount}
          handleClick={handlePagerNextClick}
          isNext
        >
          Next page
        </PagerButton>
      </div>
    </section>
  );
};
