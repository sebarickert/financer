import { clsx } from 'clsx';
import { FC, ReactNode } from 'react';

import { Link } from '$elements/Link';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

type HeadingProps = {
  variant?: HeadingVariants;
  children: ReactNode;
  titleClassName?: string;
  className?: string;
  testId?: string;
  cta?: {
    label: string;
    url: string;
    entityTitle?: string;
  };
  noMargin?: boolean;
  disableResponsiveSizing?: boolean;
};

export const Heading: FC<HeadingProps> = ({
  variant = 'h2',
  children,
  titleClassName = '',
  className = '',
  testId,
  cta,
  noMargin,
  disableResponsiveSizing,
}) => {
  const HeadingType = variant;

  return (
    <div
      className={clsx('flex', className, {
        ['justify-between items-end']: cta,
        ['mb-2 lg:mb-4']: variant !== 'h1' && !noMargin,
      })}
    >
      <HeadingType
        className={clsx(
          'theme-text-primary text-lg font-medium',
          titleClassName,
          {
            ['lg:text-2xl']: variant !== 'h1' && !disableResponsiveSizing,
            ['lg:text-3xl lg:font-semibold']: variant === 'h1',
          },
        )}
        data-testid={testId}
      >
        {children}
      </HeadingType>
      {cta && cta.url && cta.label && (
        <Link
          href={cta.url}
          className={clsx('theme-link')}
          data-entity-title={cta.entityTitle ?? undefined}
          transition="slideInFromRight"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
};
