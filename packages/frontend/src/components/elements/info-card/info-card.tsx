import clsx from 'clsx';

import { Heading } from '../../heading/heading';
import { Icon, IconName } from '../../icon/icon';

interface InfoCardProps {
  className?: string;
  children: string;
  label: string;
  isLarge?: boolean;
  isSmall?: boolean;
  iconName?: IconName;
  testId?: string;
}

export const InfoCard = ({
  className = '',
  children,
  label,
  isLarge,
  isSmall,
  iconName,
  testId,
}: InfoCardProps): JSX.Element => {
  return (
    <section
      className={clsx('rounded-md p-6 bg-gray', {
        [className]: true,
      })}
    >
      {iconName && (
        <span
          className={clsx(
            'inline-flex items-center justify-center mb-6 bg-charcoal rounded-full h-11 w-11',
            {
              ['max-md:h-9 max-md:w-9 max-md:mb-3']: !isLarge && !isSmall,
              ['h-9 w-9 mb-3']: isSmall,
            }
          )}
        >
          <Icon
            type={iconName}
            className={clsx('flex-shrink-0 pointer-events-none stroke-white', {
              ['max-md:h-6 max-md:w-6']: !isLarge && !isSmall,
              ['h-6 w-6']: isSmall,
            })}
          />
        </span>
      )}
      <Heading
        titleClassName={clsx(
          '!font-medium truncate text-gray-darkest !text-lg',
          {
            ['max-md:!text-sm']: !isLarge && !isSmall,
            ['!text-sm']: isSmall,
          }
        )}
      >
        {label}
      </Heading>
      <p
        className={clsx(
          'font-bold tracking-tight truncate text-3xl text-black',
          {
            ['max-md:text-xl']: !isLarge && !isSmall,
            ['text-xl']: isSmall,
          }
        )}
        data-testid={testId}
      >
        {children}
      </p>
    </section>
  );
};
