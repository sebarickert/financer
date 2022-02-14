import React from 'react';

import { Heading } from '../heading/heading';

interface BalanceGraphProps {
  className?: string;
}

export const BalanceGraph = ({
  className = '',
}: BalanceGraphProps): JSX.Element => {
  return (
    <div
      className={`bg-white border rounded-lg flex items-center justify-center aspect-video md:aspect-auto ${className}`}
    >
      <Heading variant="h2">Coming soon ...</Heading>
    </div>
  );
};
