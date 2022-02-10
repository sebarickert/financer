import React from 'react';

interface HeadingProps {
  variant?: 'h1' | 'h2';
  children: string;
  className?: string;
}

export const Heading = ({
  variant = 'h2',
  children,
  className = '',
}: HeadingProps) => {
  const HeadingType = variant;

  return (
    <HeadingType
      className={`!font-bold !leading-tight tracking-tighter text-gray-900 ${className}
        ${variant === 'h1' ? 'text-4xl' : ''}
        ${variant === 'h2' ? 'text-3xl' : ''}
      `}
    >
      {children}
    </HeadingType>
  );
};
