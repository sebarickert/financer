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
    <div className="grid grid-cols-2 gap-4 py-4" data-testid={testId}>
      <dt
        className="text-sm font-medium text-gray-500"
        data-testid={`${testId}_label`}
      >
        {label}
      </dt>
      <dd className="text-sm text-gray-900" data-testid={`${testId}_content`}>
        {children}
      </dd>
    </div>
  );
};
