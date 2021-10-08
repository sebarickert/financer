import React from 'react';

export interface IDescriptionListItemProps {
  label: string;
  children: string;
  testId?: string;
}

export const DescriptionListItem = ({
  label,
  children,
  testId,
}: IDescriptionListItemProps): JSX.Element => {
  return (
    <div className="py-4 grid grid-cols-2 gap-4" data-test-id={testId}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </div>
  );
};
