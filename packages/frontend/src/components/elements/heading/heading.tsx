import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { Link } from '$elements/Link';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  variant?: HeadingVariants;
  children: string | ReactNode;
  titleClassName?: string;
  className?: string;
  testId?: string;
  ctaUrl?: string;
  ctaLabel?: string;
  ctaEntityTitle?: string;
}

export const Heading = ({
  variant = 'h2',
  children,
  titleClassName = '',
  className = '',
  testId,
  ctaLabel,
  ctaUrl,
  ctaEntityTitle,
}: HeadingProps) => {
  const HeadingType = variant;

  return (
    <section
      className={clsx('flex', {
        ['justify-between items-end']: ctaUrl && ctaLabel,
        [className]: true,
      })}
    >
      <HeadingType
        className={clsx('text-black text-lg font-medium tracking-tight', {
          [titleClassName]: true,
          ['lg:text-xl']: variant !== 'h1',
          ['lg:text-2xl']: variant === 'h1',
        })}
        data-testid={testId}
      >
        {children}
      </HeadingType>
      {ctaUrl && ctaLabel && (
        <Link
          href={ctaUrl}
          className="flex-shrink-0 tracking-tight text-charcoal hover:underline"
          data-entity-title={ctaEntityTitle ?? undefined}
          transition="slideInFromRight"
        >
          {ctaLabel}
        </Link>
      )}
    </section>
  );
};
