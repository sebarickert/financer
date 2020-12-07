import React from "react";

interface IProps {
  children: React.ReactNode;
}

const DescriptionListBody = ({ children }: IProps): JSX.Element => {
  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl className="sm:divide-y sm:divide-gray-200">{children}</dl>
    </div>
  );
};

export default DescriptionListBody;
