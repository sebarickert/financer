import clsx from 'clsx';

import { Heading } from '../heading/heading';
import { Icon, IconName } from '../icon/icon';

interface DashboardStatsItemProps {
  className?: string;
  children: string;
  label: string;
  itemType: 'balance' | 'income' | 'expense';
  isLarge?: boolean;
}

export const DashboardStatsItem = ({
  className = '',
  children,
  label,
  itemType,
  isLarge,
}: DashboardStatsItemProps): JSX.Element => {
  const iconTypeMapping: {
    [key in 'balance' | 'income' | 'expense']: IconName;
  } = {
    expense: IconName.upload,
    income: IconName.download,
    balance: IconName.documentReport,
  };

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
            ['max-md:h-8 max-md:w-8 max-md:mb-4']: !isLarge,
          }
        )}
      >
        <Icon
          type={iconTypeMapping[itemType]}
          className={clsx('flex-shrink-0 pointer-events-none stroke-white', {
            ['max-md:h-5 max-md:w-5']: !isLarge,
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
      >
        {children}
      </p>
    </section>
  );
};
