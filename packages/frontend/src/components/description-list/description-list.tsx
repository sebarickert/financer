import React from 'react';

import { IconName } from '../icon/icon';

import { DescriptionListBody } from './description-list.body';
import { DescriptionListHeader } from './description-list.header';

interface IDescriptionListProps {
  label: string;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
  icon?: IconName;
}

export const DescriptionList = ({
  icon,
  label,
  className = '',
  children,
  testId,
}: IDescriptionListProps): JSX.Element => {
  return (
    <section className={`${className}`} data-testid={testId}>
      <DescriptionListHeader
        icon={icon}
        label={label}
        testId={`${testId}_list-header`}
      />
      <DescriptionListBody testId={`${testId}_list-body`}>
        {children}
      </DescriptionListBody>
    </section>
  );
};
