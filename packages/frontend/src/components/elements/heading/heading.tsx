import { clsx } from 'clsx';
import { ReactNode } from 'react';

import { LinkViewTransition } from '$elements/link/link-view-transition';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  variant?: HeadingVariants;
  style?: HeadingVariants;
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
  style,
  testId,
  ctaLabel,
  ctaUrl,
  ctaEntityTitle,
}: HeadingProps) => {
  const HeadingType = variant;
  const styleToApply = style || variant;

  const headingSize = clsx('text-xl font-medium tracking-tight');

  return (
    <section
      className={clsx('flex', {
        ['justify-between items-end']: ctaUrl && ctaLabel,
        [className]: true,
      })}
    >
      <HeadingType
        className={clsx('text-black', {
          [titleClassName]: true,
          [headingSize]: true,
          // [headingSize]: styleToApply === 'h1',
          // [headingSize]: styleToApply === 'h2',
          // [headingSize]: styleToApply === 'h3',
          // [headingSize]: styleToApply === 'h4',
        })}
        data-testid={testId}
      >
        {children}
      </HeadingType>
      {ctaUrl && ctaLabel && (
        <LinkViewTransition
          href={ctaUrl}
          className="flex-shrink-0 font-medium tracking-tight text-charcoal hover:underline"
          data-entity-title={ctaEntityTitle ?? undefined}
          transition="open-from-right"
        >
          {ctaLabel}
        </LinkViewTransition>
      )}
    </section>
  );
};
