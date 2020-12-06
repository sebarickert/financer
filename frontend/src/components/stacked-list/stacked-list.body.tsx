import React from "react";

interface IProps {
  children: React.ReactNode;
}

const StackedListBody = ({ children }: IProps): JSX.Element => {
  return (
    <div className="bg-white shadow overflow-hidden mt-4 -mx-4 md:mx-auto md:rounded-md">
      <ul className="divide-y divide-gray-200">{children}</ul>
    </div>
  );
};

export default StackedListBody;
