import React, { Children } from 'react';

interface ITransactionStackedListRowsProps {
  children: React.ReactNode | React.ReactNode[];
}

export const TransactionStackedListRows = ({
  children,
}: ITransactionStackedListRowsProps): JSX.Element => {
  return (
    <ul className="-mx-4" data-testid="transaction-stacked-list-container">
      {Children.map(children, (child) => child)}
    </ul>
  );
};
