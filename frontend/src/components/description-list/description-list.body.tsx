import React from "react";

interface IProps {
  children: React.ReactNode;
  testId?: string;
}

const DescriptionListBody = ({ children, testId }: IProps): JSX.Element => {
  return (
    <div className="border-t border-gray-200 p-0" data-test-id={testId}>
      <dl className="divide-y divide-gray-200">{children}</dl>
    </div>
  );
};

export default DescriptionListBody;
