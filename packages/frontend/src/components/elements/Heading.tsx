import { clsx } from 'clsx';
import { FC, ReactNode } from 'react';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  variant?: HeadingVariants;
  children: ReactNode;
  className?: string;
  testId?: string;
  noMargin?: boolean;
}

export const Heading: FC<HeadingProps> = ({
  variant = 'h2',
  children,
  className = '',
  testId,
  noMargin,
}) => {
  const HeadingType = variant;

  return (
    <HeadingType
      className={clsx('font-medium', className, {
        'text-lg': variant !== 'h1',
        'text-3xl/tight font-semibold tracking-tight': variant === 'h1',
        'mb-2': variant !== 'h1' && !noMargin,
      })}
      data-testid={testId}
      data-slot="heading"
    >
      {children}
    </HeadingType>
  );
};
