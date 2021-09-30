import React from "react";

export interface IProps {
  label: string;
  children: string;
  testId?: string;
}

const DescriptionListItem = ({
  label,
  children,
  testId,
}: IProps): JSX.Element => {
  return (
    <div className="py-4 grid grid-cols-2 gap-4" data-test-id={testId}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </div>
  );
};

export default DescriptionListItem;
