import { PaginationDto } from '@local/types';
import { useState } from 'react';

export type PagerOptions = {
  nextPage: {
    load(): void;
    isAvailable: boolean;
  };
  previousPage: {
    load(): void;
    isAvailable: boolean;
  };
  pageCount?: number;
  currentPage?: number;
};

type UsePageReturn = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getLoadPageFunctions(pageData: PaginationDto<unknown>): PagerOptions;
};

export const usePager = (initialPage = 1): UsePageReturn => {
  const [page, setPage] = useState(initialPage);

  return {
    page,
    setPage,
    getLoadPageFunctions: (pageData) => ({
      nextPage: {
        load: () => pageData.hasNextPage && setPage((prevPage) => prevPage + 1),
        isAvailable: pageData.hasNextPage,
      },
      previousPage: {
        load: () =>
          pageData.hasPreviousPage && setPage((prevPage) => prevPage - 1),
        isAvailable: pageData.hasPreviousPage,
      },
      pageCount: pageData.totalPageCount,
      currentPage: pageData.currentPage,
    }),
  };
};
