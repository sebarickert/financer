import React from 'react';

interface ITransactionStackedListRowsProps {
  children: React.ReactNode;
}

export const TransactionStackedListRows = ({
  children,
}: ITransactionStackedListRowsProps): JSX.Element => {
  return (
    <ul className="-mx-4" data-testid="transaction-stacked-list-container">
      {children}
    </ul>
  );
};
