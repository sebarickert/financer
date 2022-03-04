import React, { useEffect, useState } from 'react';

import { Loader } from '../loader/loader';
import { Pager } from '../pager/pager';

import {
  TransactionStackedListRow,
  ITransactionStackedListRowProps,
} from './transaction-stacked-list.row';
import { TransactionStackedListRows } from './transaction-stacked-list.rows';

interface ITransactionStackedListProps {
  title?: string;
  rows: ITransactionStackedListRowProps[];
  className?: string;
}

export const TransactionStackedList = ({
  title,
  rows,
  className = '',
}: ITransactionStackedListProps): JSX.Element => {
  const [pages, setPages] = useState<
    null | ITransactionStackedListRowProps[][]
  >(null);
  const [currentPage, setCurrentPage] = useState(0);

  const chunkAmount = 5;

  useEffect(() => {
    setPages(
      rows.reduce(
        (
          resultArray: ITransactionStackedListRowProps[][],
          item,
          index: number
        ) => {
          const chunkIndex = Math.floor(index / chunkAmount);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
          }

          resultArray[chunkIndex].push(item);

          return resultArray;
        },
        []
      )
    );
  }, [rows]);

  return !pages || !pages[currentPage] ? (
    <Loader loaderColor="blue" />
  ) : (
    <section className={`${className}`}>
      {title && <h2 className="sr-only">{title}</h2>}
      <TransactionStackedListRows>
        {pages[currentPage].map(
          ({
            transactionCategories,
            transactionAmount,
            date,
            label,
            link,
            transactionType,
            id,
          }) => (
            <TransactionStackedListRow
              key={id}
              transactionAmount={transactionAmount}
              transactionCategories={transactionCategories}
              date={date}
              label={label}
              link={link}
              transactionType={transactionType}
              id={id}
            />
          )
        )}
      </TransactionStackedListRows>
      {chunkAmount < rows.length && (
        <Pager
          currentPage={currentPage}
          pageCount={pages.length}
          handlePageUpdate={setCurrentPage}
          isCentered
          className="mt-4"
        />
      )}
    </section>
  );
};
