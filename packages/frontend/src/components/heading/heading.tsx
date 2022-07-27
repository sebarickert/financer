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
      className={`flex ${
        ctaUrl && ctaLabel ? 'justify-between items-end' : ''
      } ${className}`}
    >
      <HeadingType
        className={`!font-bold !leading-tight tracking-tighter text-gray-900 truncate ${titleClassName}
        ${styleToApply === 'h1' ? 'text-2xl lg:text-3xl' : ''}
        ${styleToApply === 'h2' ? 'text-xl lg:text-2xl' : ''}
        ${styleToApply === 'h3' ? 'text-lg lg:text-xl' : ''}
        ${styleToApply === 'h4' ? 'text-md lg:text-lg' : ''}
        `}
        data-testid={testId}
      >
        {children}
      </HeadingType>
      {ctaUrl && ctaLabel && (
        <NavLink
          to={ctaUrl}
          className="flex-shrink-0 font-medium text-blue-financer hover:underline"
          data-entity-title={ctaEntityTitle ?? undefined}
        >
          {ctaLabel}
        </NavLink>
      )}
    </section>
  );
};
