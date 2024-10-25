import { FC } from 'react';

import { Icon, IconName } from '$elements/Icon';

export type DetailsItem = {
  icon: IconName;
  label: string;
  description: string | React.ReactNode;
  testId?: string;
};

export const DetailsListItem: FC<DetailsItem> = ({
  icon,
  label,
  description,
  testId,
}) => {
  return (
    <div
      className="grid grid-cols-[auto,1fr] gap-2 items-center"
      data-testid={testId}
    >
      <dt className="inline-flex items-center gap-2">
        <Icon name={icon} />
        <span data-testid={`${testId}-label`}>{label}</span>
      </dt>
      <dd className="font-medium text-right truncate">
        <span data-testid={`${testId}-description`}>{description}</span>
      </dd>
    </div>
  );
};
