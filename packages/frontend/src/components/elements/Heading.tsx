import { clsx } from 'clsx';
import { FC, ReactNode } from 'react';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

type HeadingProps = {
  variant?: HeadingVariants;
  children: ReactNode;
  className?: string;
  testId?: string;
  noMargin?: boolean;
  disableResponsiveSizing?: boolean;
};

export const Heading: FC<HeadingProps> = ({
  variant = 'h2',
  children,
  className = '',
  testId,
  noMargin,
  disableResponsiveSizing,
}) => {
  const HeadingType = variant;

  return (
    <HeadingType
      className={clsx(' font-medium', className, {
        'text-lg': variant !== 'h1',
        'lg:text-2xl': variant !== 'h1' && !disableResponsiveSizing,
        'lg:text-3xl lg:font-semibold': variant === 'h1',
        ['mb-4']: variant !== 'h1' && !noMargin,
      })}
      data-testid={testId}
    >
      {children}
    </HeadingType>
  );
};
