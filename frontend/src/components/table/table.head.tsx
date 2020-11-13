import React from "react";

interface IProps {
  children: React.ReactNode;
}

const TableHead = ({ children }: IProps): JSX.Element => {
  return (
    <thead className="bg-white divide-y divide-gray-200">
      <tr>{children}</tr>
    </thead>
  );
};

export default TableHead;
