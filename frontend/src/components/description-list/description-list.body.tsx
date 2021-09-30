import React from "react";

interface IProps {
  children: React.ReactNode;
  testId?: string;
}

const DescriptionListBody = ({ children, testId }: IProps): JSX.Element => {
  return (
    <div data-test-id={testId}>
      <dl className="divide-y">{children}</dl>
    </div>
  );
};

export default DescriptionListBody;
