import classNames from 'classnames';
import { ReactNode } from 'react';

import { DescriptionListProps } from './description-list';

export interface DescriptionListItemProps {
  label: string;
  children: string | ReactNode;
  testId?: string;
  isLarge?: boolean;
  variant?: DescriptionListProps['variant'];
}

export const DescriptionListItem = ({
  label,
  children,
  testId,
  isLarge,
  variant,
}: DescriptionListItemProps): JSX.Element => {
  return (
    <>
      <dt
        className={classNames('font-medium truncate text-center', {
          'text-sm lg:text-base': isLarge,
          'text-xs lg:text-sm': !isLarge,
          'text-gray-700': variant === 'gray',
          'text-gray-400': variant === 'black',
        })}
      >
        {label}
      </dt>
      <dd
        className={classNames('font-bold tracking-tight truncate text-center', {
          'text-3xl': isLarge,
          'text-xl': !isLarge,
        })}
        data-testid={testId}
      >
        {children}
      </dd>
    </>
  );
};
