import React from 'react';

interface ITableHeadProps {
  children: React.ReactNode;
}

export const TableHead = ({ children }: ITableHeadProps): JSX.Element => {
  return (
    <thead className="bg-white divide-y divide-gray-200">
      <tr>{children}</tr>
    </thead>
  );
};
