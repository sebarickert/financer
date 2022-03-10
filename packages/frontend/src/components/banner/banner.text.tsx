import React from 'react';

interface IBannerTextProps {
  children: string;
  className?: string;
}

export const BannerText = ({
  children,
  className = '',
}: IBannerTextProps): JSX.Element => (
  <p className={`text-lg max-w-xl ${className}`}>{children}</p>
);
