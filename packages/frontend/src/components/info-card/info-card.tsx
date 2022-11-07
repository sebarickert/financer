import clsx from 'clsx';

import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

interface InfoCardProps {
  className?: string;
  children: string;
  label: string;
  isLarge?: boolean;
  iconName: IconName;
  testId?: string;
}

export const InfoCard = ({
  className = '',
  children,
  label,
  isLarge,
  iconName,
  testId,
}: InfoCardProps): JSX.Element => {
  return (
    <section
      className={clsx('rounded-md p-6 bg-gray-50', {
        [className]: true,
      })}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center mb-6 bg-gray-900 rounded-full h-11 w-11',
          {
            ['max-md:h-9 max-md:w-9 max-md:mb-3']: !isLarge,
          }
        )}
      >
        <Icon
          type={iconName}
          className={clsx('flex-shrink-0 pointer-events-none stroke-white', {
            ['max-md:h-6 max-md:w-6']: !isLarge,
          })}
        />
      </span>
      <Heading
        titleClassName={clsx('!font-medium truncate text-gray-600 !text-lg', {
          ['max-md:!text-sm']: !isLarge,
        })}
      >
        {label}
      </Heading>
      <p
        className={clsx('font-bold tracking-tight truncate text-3xl', {
          ['max-md:text-xl']: !isLarge,
        })}
        data-testid={testId}
      >
        {children}
      </p>
    </section>
  );
};
