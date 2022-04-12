import React from 'react';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  variant?: HeadingVariants;
  style?: HeadingVariants;
  children: string;
  className?: string;
  testId?: string;
}

export const Heading = ({
  variant = 'h2',
  children,
  className = '',
  style,
  testId,
}: HeadingProps) => {
  const HeadingType = variant;
  const styleToApply = style || variant;

  return (
    <HeadingType
      className={`!font-bold !leading-tight tracking-tighter text-gray-900 ${className}
        ${styleToApply === 'h1' ? 'text-2xl lg:text-3xl' : ''}
        ${styleToApply === 'h2' ? 'text-xl lg:text-2xl' : ''}
        ${styleToApply === 'h3' ? 'text-lg lg:text-xl' : ''}
        ${styleToApply === 'h4' ? 'text-md lg:text-lg' : ''}
      `}
      data-testid={testId}
    >
      {children}
    </HeadingType>
  );
};
