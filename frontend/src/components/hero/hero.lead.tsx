import React from 'react';

interface HeroLeadProps {
  children: string;
  className?: string;
}

export const HeroLead = ({
  children,
  className = '',
}: HeroLeadProps): JSX.Element => (
  <h2 className={`mt-5 text-xl leading-7 text-gray-300 ${className}`}>
    {children}
  </h2>
);
