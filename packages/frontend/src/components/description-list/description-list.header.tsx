import React from 'react';

interface IDescriptionListHeaderProps {
  label: string;
  testId?: string;
  visibleLabel: boolean;
}

export const DescriptionListHeader = ({
  label,
  testId,
  visibleLabel,
}: IDescriptionListHeaderProps): JSX.Element => {
  return (
    <div className="pb-2" data-testid={testId}>
      <h3
        className={`text-lg leading-6 font-medium text-gray-900 ${
          !visibleLabel && 'sr-only'
        }`}
      >
        {label}
      </h3>
    </div>
  );
};
