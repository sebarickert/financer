import React from 'react';

import { StatsHeader } from './stats.header';

interface IStatsProps {
  children: React.ReactNode[];
  label?: string;
  className?: string;
}

export const Stats = ({
  children,
  label,
  className = '',
}: IStatsProps): JSX.Element => {
  return (
    <section className={`${className}`}>
      {label && <StatsHeader>{label}</StatsHeader>}
      <div
        className={`grid gap-4 ${
          children.filter((child) => typeof child !== 'undefined' && child)
            .length %
            3 ===
          0
            ? 'md:grid-cols-3'
            : 'sm:grid-cols-2'
        }`}
      >
        {children}
      </div>
    </section>
  );
};
