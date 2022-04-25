import { ReactNode } from 'react';

export interface IDescriptionListItemProps {
  label: string;
  children: string | ReactNode;
  testId?: string;
  isLarge?: boolean;
}

export const DescriptionListItem = ({
  label,
  children,
  testId,
  isLarge,
}: IDescriptionListItemProps): JSX.Element => {
  return (
    <>
      <dt
        className={`${
          isLarge ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'
        } font-medium text-gray-700 truncate`}
      >
        {label}
      </dt>
      <dd
        className={`font-bold tracking-tight truncate ${
          isLarge ? 'text-3xl' : 'text-xl'
        }`}
        data-testid={testId}
      >
        {children}
      </dd>
    </>
  );
};
