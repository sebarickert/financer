import React from 'react';

interface ITransactionStackedListRowsProps {
  children: React.ReactNode;
}

export const TransactionStackedListRows = ({
  children,
}: ITransactionStackedListRowsProps): JSX.Element => {
  return (
    <ul
      className="border rounded-lg overflow-hidden divide-y"
      data-testid="transaction-stacked-list-container"
    >
      {children}
    </ul>
  );
};