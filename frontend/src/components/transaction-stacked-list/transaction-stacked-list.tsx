import React from "react";
import TransactionStackedListRow, {
  ITransactionStackedListRowProps,
} from "./transaction-stacked-list.row";
import TransactionStackedListRows from "./transaction-stacked-list.rows";

interface ITransactionStackedListProps {
  title?: string;
  rows: ITransactionStackedListRowProps[];
  className?: string;
}

const TransactionStackedList = ({
  title,
  rows,
  className = "",
}: ITransactionStackedListProps): JSX.Element => {
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
    </section>
  );
};

export default TransactionStackedList;
