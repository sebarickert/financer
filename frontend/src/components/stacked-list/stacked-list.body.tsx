import React from "react";

interface IProps {
  children: React.ReactNode;
}

const StackedListBody = ({ children }: IProps): JSX.Element => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md mt-4">
      <ul className="divide-y divide-gray-200">{children}</ul>
    </div>
  );
};

export default StackedListBody;
