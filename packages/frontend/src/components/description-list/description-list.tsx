import React from 'react';

import { DropdownItemType } from '../dropdown/dropdown';
import { IconName } from '../icon/icon';

import { DescriptionListBody } from './description-list.body';
import { DescriptionListHeader } from './description-list.header';

interface DescriptionListProps {
  label?: string;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
  icon?: IconName;
  filterOptions?: DropdownItemType[];
}

export const DescriptionList = ({
  icon,
  label,
  className = '',
  children,
  testId,
  filterOptions,
}: DescriptionListProps): JSX.Element => {
  return (
    <section className={`${className}`} data-testid={testId}>
      {label && (
        <DescriptionListHeader
          icon={icon}
          label={label}
          filterOptions={filterOptions}
          testId={`${testId}_list-header`}
        />
      )}
      <DescriptionListBody testId={`${testId}_list-body`}>
        {children}
      </DescriptionListBody>
    </section>
  );
};
