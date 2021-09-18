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
    <div
      className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 px-4"
      data-test-id={testId}
    >
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {children}
      </dd>
    </div>
  );
};

export default DescriptionListItem;
