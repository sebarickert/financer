import React from 'react';

import { Heading } from '../heading/heading';

interface IBannerProps {
  className?: string;
  headindType?: 'h1' | 'h2';
  title: string;
  children: React.ReactNode;
  testId?: string;
}

export const Banner = ({
  className = '',
  headindType = 'h2',
  title,
  children,
  testId,
}: IBannerProps): JSX.Element => {
  return (
    <div
      className={`p-6 rounded-lg bg-black-off text-white space-y-4 ${className}`}
      data-testId={testId}
    >
      <Heading
        data-testId="banner-title"
        variant={headindType}
        className="text-white"
      >
        {title}
      </Heading>
      <div className={`text-gray-300`}>{children}</div>
    </div>
  );
};
