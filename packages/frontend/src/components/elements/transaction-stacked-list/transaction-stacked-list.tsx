import { PagerOptions } from '../../../hooks/usePager';
import { Pager } from '../../blocks/pager/pager';

import {
  TransactionStackedListRow,
  TransactionStackedListRowProps,
} from './transaction-stacked-list.row';
import { TransactionStackedListRows } from './transaction-stacked-list.rows';

interface TransactionStackedListProps {
  title?: string;
  rows: TransactionStackedListRowProps[];
  pagerOptions: PagerOptions;
  className?: string;
  isPagerHidden?: boolean;
}

export const TransactionStackedList = ({
  title,
  rows,
  className = '',
  pagerOptions,
  isPagerHidden,
}: TransactionStackedListProps): JSX.Element | null => {
  if (!rows.length) {
    return (
      <section className={`${className}`}>
        <p className="text-gray-700">No transactions to show</p>
      </section>
    );
  }

  return (
    <section className={`${className}`}>
      {title && <h2 className="sr-only">{title}</h2>}
      <TransactionStackedListRows>
        {rows.map(
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
      {pagerOptions.pageCount &&
        pagerOptions.pageCount > 1 &&
        !isPagerHidden && (
          <Pager isCentered className="mt-4" pagerOptions={pagerOptions} />
        )}
    </section>
  );
};
