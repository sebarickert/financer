import React from 'react';

import { DescriptionListBody } from './description-list.body';
import { DescriptionListHeader } from './description-list.header';

interface IDescriptionListProps {
  label: string;
  className?: string;
  children: React.ReactNode;
  testId?: string;
  visibleLabel?: boolean;
}

export const DescriptionList = ({
  label,
  className = '',
  children,
  testId,
  visibleLabel = false,
}: IDescriptionListProps): JSX.Element => {
  return (
    <div className={`${className}`} data-testid={testId}>
      <DescriptionListHeader
        label={label}
        visibleLabel={visibleLabel}
        testId={`${testId}_list-header`}
      />
      <DescriptionListBody testId={`${testId}_list-body`}>
        {children}
      </DescriptionListBody>
    </div>
  );
};
