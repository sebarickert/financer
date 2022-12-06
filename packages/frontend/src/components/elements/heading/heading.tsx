import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

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

  return (
    <section
      className={clsx('flex', {
        ['justify-between items-end']: ctaUrl && ctaLabel,
        [className]: true,
      })}
    >
      <HeadingType
        className={clsx(
          'font-bold !leading-tight tracking-tighter text-black truncate',
          {
            [titleClassName]: true,
            ['text-2xl lg:text-3xl']: styleToApply === 'h1',
            ['text-xl lg:text-2xl']: styleToApply === 'h2',
            ['text-lg lg:text-xl']: styleToApply === 'h3',
            ['text-md lg:text-lg']: styleToApply === 'h4',
          }
        )}
        data-testid={testId}
      >
        {children}
      </HeadingType>
      {ctaUrl && ctaLabel && (
        <NavLink
          to={ctaUrl}
          className="flex-shrink-0 font-medium tracking-tight text-charcoal hover:underline"
          data-entity-title={ctaEntityTitle ?? undefined}
        >
          {ctaLabel}
        </NavLink>
      )}
    </section>
  );
};