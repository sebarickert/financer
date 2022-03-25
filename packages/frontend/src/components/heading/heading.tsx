import React from 'react';

type HeadingVariants = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps {
  variant?: HeadingVariants;
  style?: HeadingVariants;
  children: string;
  className?: string;
}

export const Heading = ({
  variant = 'h2',
  children,
  className = '',
  style,
}: HeadingProps) => {
  const HeadingType = variant;
  const styleToApply = style || variant;

  return (
    <HeadingType
      className={`!font-bold !leading-tight tracking-tighter text-gray-900 ${className}
        ${styleToApply === 'h1' ? 'text-3xl' : ''}
        ${styleToApply === 'h2' ? 'text-2xl' : ''}
        ${styleToApply === 'h3' ? 'text-xl' : ''}
        ${styleToApply === 'h4' ? 'text-lg' : ''}
      `}
    >
      {children}
    </HeadingType>
  );
};
