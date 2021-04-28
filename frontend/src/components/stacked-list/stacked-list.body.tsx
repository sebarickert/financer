import React from "react";

interface IProps {
  children: React.ReactNode;
}

const StackedListBody = ({ children }: IProps): JSX.Element => {
  return (
    <div className="bg-white border border-gray-200 flex-1">
      <ul className="divide-y divide-gray-200">{children}</ul>
    </div>
  );
};

export default StackedListBody;
