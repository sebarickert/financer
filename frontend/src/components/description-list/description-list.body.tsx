import React from 'react';

interface IDescriptionListBodyProps {
  children: React.ReactNode;
  testId?: string;
}

export const DescriptionListBody = ({
  children,
  testId,
}: IDescriptionListBodyProps): JSX.Element => {
  return (
    <div data-test-id={testId}>
      <dl className="divide-y">{children}</dl>
    </div>
  );
};
