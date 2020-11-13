import React from "react";

interface IProps {
  children: React.ReactNode;
}

const TableBody = ({ children }: IProps): JSX.Element => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
  );
};

export default TableBody;
