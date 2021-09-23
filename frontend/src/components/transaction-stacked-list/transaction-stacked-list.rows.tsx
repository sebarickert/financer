import React from "react";

interface ITransactionStackedListRowsProps {
  children: React.ReactNode;
}

const TransactionStackedListRows = ({
  children,
}: ITransactionStackedListRowsProps): JSX.Element => {
  return <ul className="space-y-4">{children}</ul>;
};

export default TransactionStackedListRows;
