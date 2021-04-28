import React from "react";

interface IProps {
  children: React.ReactNode;
}

const DescriptionListBody = ({ children }: IProps): JSX.Element => {
  return (
    <div className="border-t border-gray-200 p-0">
      <dl className="divide-y divide-gray-200">{children}</dl>
    </div>
  );
};

export default DescriptionListBody;
