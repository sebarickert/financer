import React from 'react';

interface ITableBodyProps {
  children: React.ReactNode;
}

export const TableBody = ({ children }: ITableBodyProps): JSX.Element => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
  );
};
