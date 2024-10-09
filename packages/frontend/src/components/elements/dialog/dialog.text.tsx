import clsx from 'clsx';

import { Heading } from '../heading/heading';
import { Paragraph } from '../paragraph/paragraph';

import { Icon, IconName } from '$elements/Icon';

interface DialogTextProps {
  children?: string;
  className?: string;
  label: string;
  iconName?: IconName;
}

export const DialogText = ({
  children,
  className = '',
  label,
  iconName,
}: DialogTextProps) => {
  return (
    <section className={clsx('grid', { [className]: true })}>
      {iconName && (
        <span
          className={clsx(
            'inline-flex items-center justify-center bg-charcoal rounded-full h-11 w-11 mb-6',
          )}
        >
          <Icon
            name={iconName}
            className={clsx(
              'flex-shrink-0 pointer-events-none stroke-white',
              {},
            )}
          />
        </span>
      )}
      <Heading>{label}</Heading>
      {children && <Paragraph className="mt-2">{children}</Paragraph>}
    </section>
  );
};
